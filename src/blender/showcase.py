"""Two more NestedFusion 3D pieces, built headless with Blender's Python module (bpy 5.2).

  hex   - "Hex core": nested cubes seen corner-on, so they read as hexagons. A teal glass shell with
          brushed-steel edges and beads, a gloss-black frame inside it, an inner glass cube, and a
          glowing teal core wired out to the shell's corners.
  fusion - "Fusion data core": a rounded aluminium dodecahedron with twelve pentagon windows, each
          ringed by two rubber gaskets and glazed, around a dark sphere wrapped in light rings.

Usage:
  python3 src/blender/showcase.py export <hex|fusion> <out.glb>
  python3 src/blender/showcase.py render <hex|fusion> <out.png> [size] [samples]
Shares the studio, camera and render setup with nested_core.py.
"""
import math, os, random, sys
import bpy  # must come first: it puts Blender's bundled modules (bmesh) on the path
import bmesh
from mathutils import Matrix, Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from nested_core import apply_mods, camera, cycles, ground, mat, reset, shade_smooth, studio  # noqa: E402

TEAL_GLOW = (0.12, 0.85, 0.9)
STEEL = (0.62, 0.64, 0.66)
ALU = (0.5, 0.51, 0.53)


def emission(name, color, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Emission Color"].default_value = (*color, 1)
    b.inputs["Emission Strength"].default_value = strength
    return m


def join(objs, name, material=None):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    if len(objs) > 1:
        bpy.ops.object.join()
    o = bpy.context.object
    o.name = name
    shade_smooth(o)
    if material:
        o.data.materials.clear()
        o.data.materials.append(material)
    return o


def rounded_cube(size, bevel, name, shell=0.0):
    bpy.ops.mesh.primitive_cube_add(size=size)
    o = bpy.context.object
    o.name = name
    b = o.modifiers.new("bevel", "BEVEL")
    b.width, b.segments, b.limit_method = bevel, 10, "NONE"
    if shell:
        s = o.modifiers.new("shell", "SOLIDIFY")
        s.thickness, s.offset, s.use_even_offset = shell, -1, True
    o.modifiers.new("wn", "WEIGHTED_NORMAL").keep_sharp = True
    apply_mods(o)
    shade_smooth(o)
    return o


def edge_frame(half, rad, joint):
    """The twelve edges of a cube as tubes, with ball joints at the corners."""
    corners = [Vector((x, y, z)) * half for x in (-1, 1) for y in (-1, 1) for z in (-1, 1)]
    parts, mids = [], []
    for i, a in enumerate(corners):
        for b in corners[i + 1:]:
            if (a - b).length > 2 * half + 1e-6:
                continue
            d = b - a
            bpy.ops.mesh.primitive_cylinder_add(radius=rad, depth=d.length, vertices=24, location=(a + b) / 2)
            c = bpy.context.object
            c.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
            parts.append(c)
            mids.append((a + b) / 2)
    for a in corners:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=joint, segments=24, ring_count=12, location=a)
        parts.append(bpy.context.object)
    return parts, corners, mids


def tube(points, radius, name, material):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions, cu.bevel_depth, cu.bevel_resolution, cu.use_fill_caps = "3D", radius, 3, True
    for pts in points:
        sp = cu.splines.new("BEZIER")
        sp.bezier_points.add(len(pts) - 1)
        for bp, p in zip(sp.bezier_points, pts):
            bp.co = p
            bp.handle_left_type = bp.handle_right_type = "AUTO"
    o = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(o)
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.convert(target="MESH")
    o = bpy.context.object
    shade_smooth(o)
    o.data.materials.append(material)
    return o


# --------------------------------------------------------------------------- hex core
def build_hex():
    steel = mat("Steel", **{"Base Color": (*STEEL, 1), "Metallic": 1.0, "Roughness": 0.3})
    shell_glass = mat("ShellGlass", **{"Base Color": (0.5, 0.86, 0.86, 1), "Roughness": 0.1, "IOR": 1.45,
                                        "Transmission Weight": 1.0})
    inner_glass = mat("InnerGlass", **{"Base Color": (0.85, 0.97, 0.97, 1), "Roughness": 0.12, "IOR": 1.45,
                                        "Transmission Weight": 1.0})
    black = mat("Gloss", **{"Base Color": (0.008, 0.012, 0.014, 1), "Roughness": 0.16, "Coat Weight": 1.0,
                            "Coat Roughness": 0.04})
    glow = emission("Glow", TEAL_GLOW, 16.0)
    wire = emission("Wire", (0.25, 0.75, 0.78), 0.8)

    shell = rounded_cube(1.7, 0.24, "Shell", shell=0.05)
    shell.data.materials.append(shell_glass)
    parts, corners, mids = edge_frame(0.78, 0.028, 0.05)
    for m in mids:  # beads at the middle of every outer edge
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.042, segments=24, ring_count=12, location=m)
        parts.append(bpy.context.object)
    rim = join(parts, "Rim", steel)

    # Gloss-black frame: a rounded cube with a large opening cut through each pair of faces.
    frame = rounded_cube(1.16, 0.12, "Frame")
    cutters = []
    for axis in range(3):
        bpy.ops.mesh.primitive_cube_add(size=1)
        c = bpy.context.object
        sc = [0.78, 0.78, 0.78]
        sc[axis] = 3.0
        c.scale = sc
        bv = c.modifiers.new("bevel", "BEVEL")
        bv.width, bv.segments = 0.12, 6
        apply_mods(c)
        cutters.append(c)
    for c in cutters:
        bo = frame.modifiers.new("cut", "BOOLEAN")
        bo.operation, bo.object = "DIFFERENCE", c
        apply_mods(frame)
        bpy.data.objects.remove(c)
    # A hexagonal window along the body diagonal (the axis that faces the camera), so the core shows head-on.
    bpy.ops.mesh.primitive_cylinder_add(radius=0.42, depth=4, vertices=6)
    win = bpy.context.object
    win.rotation_euler = Vector((1, 1, 1)).to_track_quat("Z", "Y").to_euler()
    win.rotation_euler.rotate_axis("Z", math.radians(30))
    bv = win.modifiers.new("bevel", "BEVEL")
    bv.width, bv.segments, bv.affect = 0.08, 6, "VERTICES"
    bpy.context.view_layer.objects.active = win
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    apply_mods(win)
    bo = frame.modifiers.new("window", "BOOLEAN")
    bo.operation, bo.object = "DIFFERENCE", win
    apply_mods(frame)
    bpy.data.objects.remove(win)
    hollow = rounded_cube(0.96, 0.1, "Hollow")  # empty the frame's inside so the core shows
    bo = frame.modifiers.new("hollow", "BOOLEAN")
    bo.operation, bo.object = "DIFFERENCE", hollow
    apply_mods(frame)
    bpy.data.objects.remove(hollow)
    shade_smooth(frame)
    frame.data.materials.append(black)

    inner = rounded_cube(0.62, 0.1, "Inner", shell=0.03)
    inner.data.materials.append(inner_glass)
    iparts, icorners, _ = edge_frame(0.29, 0.014, 0.024)
    inner_rim = join(iparts, "InnerRim", steel)

    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.17, segments=64, ring_count=32)
    core = bpy.context.object
    core.name = "Core"
    shade_smooth(core)
    core.data.materials.append(glow)

    # Wires: from the core out through the inner cube's corners to the shell's corners.
    paths = []
    for ic, oc in zip(icorners, corners):
        ic_n = ic.normalized()
        paths.append([Vector((0, 0, 0)) + ic_n * 0.16, ic * 1.02, (ic + oc) * 0.5 + Vector((0, 0, 0.04)), oc * 0.96])
    wires = tube(paths, 0.006, "Wires", wire)
    return [shell, rim, frame, inner, inner_rim, core, wires]


# --------------------------------------------------------------------------- fusion data core
def dodecahedron(radius):
    phi = (1 + 5 ** 0.5) / 2
    pts = [Vector((x, y, z)) for x in (-1, 1) for y in (-1, 1) for z in (-1, 1)]
    for a in (-1, 1):
        for b in (-1, 1):
            pts += [Vector((0, a / phi, b * phi)), Vector((a / phi, b * phi, 0)), Vector((a * phi, 0, b / phi))]
    bm = bmesh.new()
    for p in pts:
        bm.verts.new(p * (radius / 3 ** 0.5))
    bmesh.ops.convex_hull(bm, input=bm.verts)
    bmesh.ops.dissolve_limit(bm, angle_limit=math.radians(1), verts=bm.verts, edges=bm.edges)
    faces = [([v.co.copy() for v in f.verts], f.calc_center_median(), f.normal.copy()) for f in bm.faces]
    me = bpy.data.meshes.new("Dodeca")
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new("Shell", me)
    bpy.context.collection.objects.link(o)
    return o, faces


def rounded_outline(verts, center, scale, radius, seg=6):
    """Corner-rounded polygon, scaled toward the face centre."""
    pts = [center + (v - center) * scale for v in verts]
    out, n = [], len(pts)
    for i in range(n):
        p0, p1, p2 = pts[i - 1], pts[i], pts[(i + 1) % n]
        a, b = (p0 - p1).normalized(), (p2 - p1).normalized()
        ang = a.angle(b)
        t = radius / math.tan(ang / 2)
        s, e = p1 + a * t, p1 + b * t
        bis = (a + b).normalized()
        c = p1 + bis * (radius / math.sin(ang / 2))
        for k in range(seg + 1):  # arc from s to e around c
            u = k / seg
            q = (s.lerp(e, u) - c).normalized() * radius + c
            out.append(q)
    return out


def build_fusion():
    alu = mat("Aluminium", **{"Base Color": (*ALU, 1), "Metallic": 1.0, "Roughness": 0.16, "Anisotropic": 0.5})
    rubber = mat("Rubber", **{"Base Color": (0.018, 0.02, 0.022, 1), "Roughness": 0.55})
    gasket2 = mat("Gasket", **{"Base Color": (0.08, 0.085, 0.09, 1), "Roughness": 0.35, "Metallic": 0.6})
    glass = mat("Window", **{"Base Color": (1, 1, 1, 1), "Roughness": 0.02, "IOR": 1.5, "Transmission Weight": 1.0})
    dark = mat("Void", **{"Base Color": (0.01, 0.015, 0.02, 1), "Roughness": 0.25, "Coat Weight": 1.0})
    light = emission("Light", (0.55, 0.9, 1.0), 9.0)

    R = 1.0
    shell, faces = dodecahedron(R)
    bv = shell.modifiers.new("bevel", "BEVEL")
    bv.width, bv.segments, bv.limit_method = 0.16, 10, "NONE"
    so = shell.modifiers.new("wall", "SOLIDIFY")
    so.thickness, so.offset, so.use_even_offset = 0.09, -1, True
    apply_mods(shell)

    # One cutter per face: a rounded pentagon pushed through the wall.
    cut_parts, rings, rings2, panes = [], [], [], []
    for verts, c, n in faces:
        outline = rounded_outline(verts, c, 0.7, 0.1)
        bm = bmesh.new()
        f = bm.faces.new([bm.verts.new(p - n * 0.3) for p in outline])
        ext = bmesh.ops.extrude_face_region(bm, geom=[f])
        bmesh.ops.translate(bm, verts=[e for e in ext["geom"] if isinstance(e, bmesh.types.BMVert)], vec=n * 0.6)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        me = bpy.data.meshes.new("cut")
        bm.to_mesh(me)
        bm.free()
        co = bpy.data.objects.new("cut", me)
        bpy.context.collection.objects.link(co)
        cut_parts.append(co)
        inset = c - n * 0.02
        rings.append([p - n * 0.02 for p in outline])
        rings2.append([p - n * 0.07 for p in rounded_outline(verts, c, 0.54, 0.07)])
        panes.append([p - n * 0.08 for p in rounded_outline(verts, c, 0.64, 0.09)])
    cutter = join(cut_parts, "Cutter")
    bo = shell.modifiers.new("windows", "BOOLEAN")
    bo.operation, bo.object = "DIFFERENCE", cutter
    apply_mods(shell)
    bpy.data.objects.remove(cutter)
    shade_smooth(shell)
    shell.modifiers.new("wn", "WEIGHTED_NORMAL").keep_sharp = True
    apply_mods(shell)
    shell.data.materials.append(alu)

    def loops(polys, rad, name, m):
        cu = bpy.data.curves.new(name, "CURVE")
        cu.dimensions, cu.bevel_depth, cu.bevel_resolution = "3D", rad, 4
        for pts in polys:
            sp = cu.splines.new("POLY")
            sp.points.add(len(pts) - 1)
            for k, p in enumerate(pts):
                sp.points[k].co = (*p, 1)
            sp.use_cyclic_u = True
        o = bpy.data.objects.new(name, cu)
        bpy.context.collection.objects.link(o)
        bpy.ops.object.select_all(action="DESELECT")
        bpy.context.view_layer.objects.active = o
        o.select_set(True)
        bpy.ops.object.convert(target="MESH")
        o = bpy.context.object
        shade_smooth(o)
        o.data.materials.append(m)
        return o

    gasket = loops(rings, 0.045, "Gasket", rubber)
    inner_gasket = loops(rings2, 0.03, "InnerGasket", gasket2)

    bm = bmesh.new()
    for pts in panes:
        bm.faces.new([bm.verts.new(p) for p in pts])
    me = bpy.data.meshes.new("Windows")
    bm.to_mesh(me)
    bm.free()
    win = bpy.data.objects.new("Windows", me)
    bpy.context.collection.objects.link(win)
    so = win.modifiers.new("t", "SOLIDIFY")
    so.thickness = 0.012
    apply_mods(win)
    win.data.materials.append(glass)

    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.46, segments=64, ring_count=32)
    void = bpy.context.object
    void.name = "Void"
    shade_smooth(void)
    void.data.materials.append(dark)

    # Light rings orbiting the void, plus a bright point at its centre.
    random.seed(11)
    parts = []
    for i in range(7):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.5 + 0.035 * i, minor_radius=0.005 + 0.002 * (i % 2),
                                         major_segments=160, minor_segments=8)
        t = bpy.context.object
        t.rotation_euler = (random.uniform(0, math.pi), random.uniform(0, math.pi), random.uniform(0, math.pi))
        parts.append(t)
    rings_obj = join(parts, "Energy", light)
    return [shell, gasket, inner_gasket, win, void, rings_obj]


def main():
    mode, which, out = sys.argv[1], sys.argv[2], sys.argv[3]
    reset()
    objs = build_hex() if which == "hex" else build_fusion()
    if mode == "export":
        bpy.ops.object.select_all(action="SELECT")
        bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", use_selection=True, export_apply=True,
                                  export_yup=True, export_materials="EXPORT", export_cameras=False,
                                  export_lights=False)
        return
    size = int(sys.argv[4]) if len(sys.argv) > 4 else 600
    samples = int(sys.argv[5]) if len(sys.argv) > 5 else 32
    studio(); ground(); camera()
    for o in bpy.data.objects:
        if o.name.endswith(("Box", "Strip")) or o.name.startswith("Card"):
            o.visible_camera = False
    # hex: a body diagonal pointed at the camera, so the nested cubes read as hexagons
    turn = (Matrix.Rotation(math.radians(-35.26), 4, "X") @ Matrix.Rotation(math.radians(45), 4, "Z")) if which == "hex" else Matrix.Rotation(math.radians(-18), 4, "Z") @ Matrix.Rotation(math.radians(12), 4, "X")
    for o in objs:
        o.matrix_world = turn @ o.matrix_world
    cycles(samples, size)
    s = bpy.context.scene
    s.render.image_settings.file_format = "PNG"
    s.render.image_settings.color_mode = "RGBA"
    s.render.filepath = out
    bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    main()
