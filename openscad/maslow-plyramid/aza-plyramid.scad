// === Parameters ===
num_layers = 6;
ply_thickness = 12.7;            // Default 1/2" plywood
top_size_mm = 40;                // Width/Length of the top layer
layer_inc_mm = 12.7;             // Increase per layer from top to bottom
center_bore_diameter = 10;       // Bore hole in center
register_hole_diameter = 3.2;
register_hole_offset = 12;       // Offset from center on X/Y

// === Computed Dimensions ===
base_size_mm = top_size_mm + (num_layers - 1) * layer_inc_mm;
total_height_mm = num_layers * ply_thickness;
echo(str("Base Size: ", base_size_mm, " mm"));
echo(str("Total Height: ", total_height_mm, " mm"));

module pyramid_layer(size) {
    difference() {
        square([size, size], center=true);
        // Center bore
        translate([0, 0]) circle(d=center_bore_diameter, $fn=64);
        // Register holes at 4 quadrants (optional)
        for (x_sign = [-1, 1], y_sign = [-1, 1]) {
            translate([x_sign * register_hole_offset, y_sign * register_hole_offset])
                circle(d=register_hole_diameter, $fn=32);
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

// === Render ===
pyramid();
