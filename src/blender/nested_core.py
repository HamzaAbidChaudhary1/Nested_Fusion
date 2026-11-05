"""NestedFusion hero object, built headless with Blender's Python module (bpy 5.2).

Three nested layers, each its own material:
  Glass   - clear block with softened edges (deep-teal at the edges from absorption)
  Frame   - graphite titanium cube frame, turned inside the glass
  Network - champagne-gold nodes and right-angle traces at the centre, after the logo's network

Usage:
  python3 src/blender/nested_core.py export  <out.glb>
  python3 src/blender/nested_core.py render  <out.png> [size] [samples] [envmap.hdr]
  python3 src/blender/nested_core.py env     <out.hdr> [width]
"""
import math, random, sys
import bpy
from mathutils import Vector

PAGE = (0.913, 0.933, 0.949)          # #E9EEF2, the site background
TEAL = (0.0, 0.42, 0.55)            # glass absorption tint
GRAPHITE = (0.055, 0.06, 0.068)
GOLD = (0.86, 0.69, 0.43)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def mat(name, **p):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    for k, v in p.items():
        b.inputs[k].default_value = v
    return m


def shade_smooth(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True


def apply_mods(obj):
    bpy.context.view_layer.objects.active = obj
    for m in list(obj.modifiers):
        bpy.ops.object.modifier_apply(modifier=m.name)


def build():
    # --- Glass block -------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=2.15)
    glass = bpy.context.object
    glass.name = "Glass"
    bev = glass.modifiers.new("bevel", "BEVEL")
    bev.width, bev.segments, bev.limit_method = 0.32, 10, "NONE"
    sol = glass.modifiers.new("shell", "SOLIDIFY")   # a thin-walled case: the frame inside reads undistorted
    sol.thickness, sol.offset, sol.use_even_offset = 0.07, -1, True
    glass.modifiers.new("wn", "WEIGHTED_NORMAL").keep_sharp = True
    apply_mods(glass)
    shade_smooth(glass)
    gm = mat("Glass", **{"Base Color": (1, 1, 1, 1), "Roughness": 0.0, "IOR": 1.5, "Thin Film Thickness": 380.0, "Thin Film IOR": 1.33,
                         "Transmission Weight": 1.0, "Coat Weight": 0.0})
    # absorption gives the edges their colour, thin faces stay clear
    nt = gm.node_tree
    vol = nt.nodes.new("ShaderNodeVolumeAbsorption")
    vol.inputs["Color"].default_value = (*TEAL, 1)
    vol.inputs["Density"].default_value = 0.9
    nt.links.new(vol.outputs[0], nt.nodes["Material Output"].inputs["Volume"])
    glass.data.materials.append(gm)

    # --- Titanium frame: twelve machined bars and eight ball joints, standing on a corner --
    half, rad = 0.6, 0.052
    corners = [Vector((x, y, z)) * half for x in (-1, 1) for y in (-1, 1) for z in (-1, 1)]
    bars = []
    for i, a in enumerate(corners):
        for b in corners[i + 1:]:
            if (a - b).length > 2 * half + 1e-6:
                continue
            mid, d = (a + b) / 2, (b - a)
            bpy.ops.mesh.primitive_cylinder_add(radius=rad, depth=d.length, vertices=32, location=mid)
            c = bpy.context.object
            c.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
            bars.append(c)
    for a in corners:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=rad * 1.9, segments=32, ring_count=16, location=a)
        bars.append(bpy.context.object)
    bpy.ops.object.select_all(action="DESELECT")
    for o in bars:
        o.select_set(True)
    bpy.context.view_layer.objects.active = bars[0]
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)  # origin at the world centre
    bpy.ops.object.join()
    frame = bpy.context.object
    frame.name = "Frame"
    shade_smooth(frame)
    frame.modifiers.new("wn", "WEIGHTED_NORMAL")
    apply_mods(frame)
    frame.rotation_euler = (math.radians(35.26), 0, math.radians(45))  # stands on a corner
    frame.data.materials.append(mat("Gold", **{"Base Color": (*GOLD, 1), "Metallic": 1.0, "Roughness": 0.14}))

    # --- Gold hub: one core wired to all eight frame corners by right-angle traces
    ink = mat("Graphite", **{"Base Color": (*GRAPHITE, 1), "Metallic": 1.0, "Roughness": 0.3})
    enamel = mat("Enamel", **{"Base Color": (0.01, 0.36, 0.5, 1), "Roughness": 0.14, "Coat Weight": 1.0, "Coat Roughness": 0.03})
    parts = []
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.2, segments=64, ring_count=32)
    core = bpy.context.object
    core.name = "Core"
    shade_smooth(core)
    core.data.materials.append(enamel)
    curve = bpy.data.curves.new("traces", "CURVE")
    curve.dimensions, curve.bevel_depth, curve.bevel_resolution = "3D", 0.022, 6
    curve.use_fill_caps = True
    orders = [(0, 1, 2), (1, 2, 0), (2, 0, 1), (0, 2, 1), (1, 0, 2), (2, 1, 0), (0, 1, 2), (2, 0, 1)]
    for c, order in zip(corners, orders):
        c = c * 0.9                                    # end on the ball joint's surface, not through it
        path, q = [Vector((0, 0, 0))], Vector((0, 0, 0))
        for ax in order:
            q = q.copy(); q[ax] = c[ax]; path.append(q)
        sp = curve.splines.new("POLY")
        sp.points.add(len(path) - 1)
        for k, pnt in enumerate(path):
            sp.points[k].co = (*pnt, 1)
        for pnt in path[1:-1]:                          # a solder pad at every bend
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.038, segments=24, ring_count=12, location=pnt)
            parts.append(bpy.context.object)
    tr = bpy.data.objects.new("traces", curve)
    bpy.context.collection.objects.link(tr)
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = tr
    tr.select_set(True)
    bpy.ops.object.convert(target="MESH")
    parts.append(bpy.context.object)
    bpy.ops.object.select_all(action="DESELECT")
    for o in parts:
        o.select_set(True)
        shade_smooth(o)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    bpy.ops.object.join()
    net = bpy.context.object
    net.name = "Network"
    net.data.materials.clear()
    net.data.materials.append(ink)
    net.rotation_euler = frame.rotation_euler.copy()
    core.rotation_euler = frame.rotation_euler.copy()
    return glass, frame, net, core


def studio(world_only=False):
    """Soft studio: page-grey surround, two big softboxes and a rim strip. Also baked out as the web environment."""
    w = bpy.data.worlds.new("Studio")
    bpy.context.scene.world = w
    w.use_nodes = True
    w.node_tree.nodes["Background"].inputs["Color"].default_value = (*PAGE, 1)
    w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.55

    def softbox(name, loc, size, power, color=(1, 1, 1)):
        bpy.ops.mesh.primitive_plane_add(size=1, location=loc)
        o = bpy.context.object
        o.name = name
        o.scale = (*size, 1)
        d = Vector((0, 0, 0)) - Vector(loc)
        o.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        nt = m.node_tree
        for n in list(nt.nodes):
            if n.type != "OUTPUT_MATERIAL":
                nt.nodes.remove(n)
        e = nt.nodes.new("ShaderNodeEmission")
        e.inputs["Color"].default_value = (*color, 1)
        e.inputs["Strength"].default_value = power
        nt.links.new(e.outputs[0], nt.nodes["Material Output"].inputs["Surface"])
        o.data.materials.append(m)
        o.visible_shadow = False
        return o

    softbox("KeyBox", (-4.2, -3.6, 4.6), (4.2, 2.6), 9.0)
    softbox("FillBox", (5.2, -2.4, 1.2), (2.4, 4.2), 3.2, (0.93, 0.97, 1.0))
    softbox("RimStrip", (1.5, 5.5, 3.0), (6.0, 0.7), 11.0)
    softbox("TopBox", (0, 0, 7.5), (3.0, 3.0), 4.0)
    # Black cards either side: give the glass its dark edge lines, as in product photography.
    for x in (-4.6, 4.6):
        bpy.ops.mesh.primitive_plane_add(size=1, location=(x, 1.2, 0.6))
        o = bpy.context.object
        o.name = "Card"
        o.scale = (2.2, 3.4, 1)
        o.rotation_euler = (Vector((0, 0, 0.3)) - Vector(o.location)).to_track_quat("-Z", "Y").to_euler()
        k = bpy.data.materials.new("Card")
        k.use_nodes = True
        k.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.01, 0.012, 0.015, 1)
        k.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.9
        o.data.materials.append(k)
        o.visible_shadow = False


def ground():
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, -1.62))
    g = bpy.context.object
    g.name = "Ground"
    g.is_shadow_catcher = True
    return g


def camera(size_deg=27):
    cam = bpy.data.cameras.new("Cam")
    cam.lens_unit, cam.angle = "FOV", math.radians(size_deg)
    o = bpy.data.objects.new("Cam", cam)
    bpy.context.collection.objects.link(o)
    o.location = (0, -8.6, 1.05)
    o.rotation_euler = (Vector((0, 0, -0.05)) - o.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = o
    return o


def cycles(samples, size):
    s = bpy.context.scene
    s.render.engine = "CYCLES"
    s.cycles.device = "CPU"
    s.cycles.samples = samples
    s.cycles.use_denoising = True
    s.cycles.max_bounces, s.cycles.transmission_bounces, s.cycles.glossy_bounces = 16, 16, 8
    s.cycles.caustics_reflective = s.cycles.caustics_refractive = False
    s.render.resolution_x = s.render.resolution_y = size
    s.render.film_transparent = True
    s.view_settings.view_transform = "AgX"
    s.view_settings.look = "AgX - Medium High Contrast"


def main():
    mode, out = sys.argv[1], sys.argv[2]
    reset()
    if mode == "env":
        # Equirect bake of the studio (no object) for three.js reflections.
        studio()
        cam = bpy.data.cameras.new("Pano")
        cam.type, cam.panorama_type = "PANO", "EQUIRECTANGULAR"
        o = bpy.data.objects.new("Pano", cam)
        bpy.context.collection.objects.link(o)
        o.rotation_euler = (math.radians(90), 0, 0)
        bpy.context.scene.camera = o
        w = int(sys.argv[3]) if len(sys.argv) > 3 else 1024
        cycles(16, w)
        s = bpy.context.scene
        s.render.resolution_y, s.render.film_transparent = w // 2, False
        s.view_settings.view_transform = "Standard"
        s.render.image_settings.file_format = "HDR"
        s.render.filepath = out
        bpy.ops.render.render(write_still=True)
        return
    glass, frame, net, core = build()
    if mode == "export":
        bpy.ops.object.select_all(action="SELECT")
        bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", use_selection=True,
                                  export_apply=True, export_yup=True, export_materials="EXPORT",
                                  export_cameras=False, export_lights=False)
        return
    if mode == "render":
        size = int(sys.argv[3]) if len(sys.argv) > 3 else 800
        samples = int(sys.argv[4]) if len(sys.argv) > 4 else 64
        studio(); ground(); camera()
        # Hide the softboxes from the camera; they still light and reflect.
        for o in bpy.data.objects:
            if o.name.endswith(("Box", "Strip")) or o.name.startswith("Card"):
                o.visible_camera = False
        # A slight turn so all three layers read.
        for o in (glass, frame, net, core):
            o.rotation_euler.z += math.radians(-28)
        glass.rotation_euler.x += math.radians(14)
        glass.rotation_euler.y += math.radians(-6)
        cycles(samples, size)
        s = bpy.context.scene
        s.render.image_settings.file_format = "PNG"
        s.render.image_settings.color_mode = "RGBA"
        s.render.filepath = out
        bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    main()
