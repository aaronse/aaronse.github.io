// === Parameters ===
num_layers = 4;
ply_thickness = 12.7;            // Default 1/2" plywood
top_size_mm = 40;                // Width/Length of the top layer
layer_inc_mm = 12.7;             // Increase per layer from top to bottom
center_bore_diameter = 10;       // Bore hole in center
register_hole_diameter = 3.2;
register_hole_offset = 12;       // Offset from center on X/Y

// === Computed ===
base_size_mm = top_size_mm + (num_layers - 1) * layer_inc_mm;
total_height_mm = num_layers * ply_thickness;
echo(str("Base Size: ", base_size_mm, " mm"));
echo(str("Total Height: ", total_height_mm, " mm"));

// === DXF Export Config ===
render_2d = false;           // Set to true for DXF export layout
part_gap = 3.175;            // Gap between layers (endmill diameter)

// === 2D layer outline with holes ===
module pyramid_layer_2d(size) {
    difference() {
        square([size, size], center=false);
        // Center bore
        translate([size/2, size/2])
            circle(d=center_bore_diameter, $fn=16);
        // Register holes
        for (x_sign = [-1, 1], y_sign = [-1, 1]) {
            translate([size/2 + x_sign * register_hole_offset, size/2 + y_sign * register_hole_offset])
                circle(d=register_hole_diameter, $fn=12);
        }
    }
}

// === 3D pyramid as before ===
module pyramid_layer(size) {
    difference() {
        square([size, size], center=true);
        circle(d=center_bore_diameter, $fn=16);
        for (x_sign = [-1, 1], y_sign = [-1, 1]) {
            translate([x_sign * register_hole_offset, y_sign * register_hole_offset])
                circle(d=register_hole_diameter, $fn=12);
        }
    }
}

module pyramid() {
    for (i = [0 : num_layers - 1]) {
        layer_size = top_size_mm + (num_layers - 1 - i) * layer_inc_mm;
        translate([0, 0, i * ply_thickness])
            linear_extrude(height = ply_thickness)
                pyramid_layer(layer_size);
    }
}

// === DXF layout ===
module pyramid_2d_layout() {
    for (i = [0 : num_layers - 1]) {
        layer_size = top_size_mm + (num_layers - 1 - i) * layer_inc_mm;
        offset = i*top_size_mm + layer_inc_mm*(i*(num_layers-1) - (i*(i-1)/2)) + i*part_gap;
        translate([offset, 0])
            pyramid_layer_2d(layer_size);
    }
}

// === Top-level ===
if (render_2d) {
    // For DXF export, ensure only 2D objects at top level
    pyramid_2d_layout();
} else {
    // 3D solid pyramid
    pyramid();
}
