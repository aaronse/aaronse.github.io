// Workbench Sketch: Normal Use vs Transit Use
// Updated with correct dimensions and box resting on panels in transit
// Dimensions in inches

// Display resolution for rendering
$fn = 4;

// --- Parameters ---
// Torsion box
torsion_x   = 60; // width (front-to-back)
torsion_y   = 44; // depth (left-to-right)
torsion_th  = 5;  // thickness

// Legs
leg_w       = 1.5;
leg_d       = 3.5;
leg_h       = 36;
leg_span_x  = 56; // footprint width (front-to-back)
leg_span_y  = 28; // footprint depth (left-to-right)

// Sheathing panels
panel_h     = 28;
panel_th    = 0.5;

// --- Modules ---

// Four corner legs
module legs() {
    for (x = [0, leg_span_x - leg_w], y = [0, leg_span_y - leg_d]) {
        translate([x, y, 0])
            cube([leg_w, leg_d, leg_h]);
    }
}

// Side (left, right) and back panels
module panels() {
    // Left side panel
    translate([0, 0, 0])
        cube([panel_th, leg_span_y, panel_h]);
    // Right side panel
    translate([leg_span_x - panel_th, 0, 0])
        cube([panel_th, leg_span_y, panel_h]);
    // Back panel
    translate([0, leg_span_y - panel_th, 0])
        cube([leg_span_x, panel_th, panel_h]);
}

// Torsion box in normal (horizontal) or transit (vertical) mode
module torsion(normal = true) {
    if (normal) {
        // Horizontal: rest on top of legs
        translate([
            (leg_span_x - torsion_x)/2,
            (leg_span_y - torsion_y)/2,
            leg_h
        ])
            cube([torsion_x, torsion_y, torsion_th]);
    } else {
        // Vertical: rest on top of side/back panels
        translate([
            (leg_span_x - torsion_x)/2,
            (leg_span_y - torsion_th)/2,
            panel_h
        ])
            rotate([90, 0, 0]) // rotate +90° to lift box so Y maps to Z
                cube([torsion_x, torsion_y, torsion_th]);
    }
}

// --- Scenes ---

// 1) Normal use configuration
legs();
panels();
torsion(true);

// 2) Transit use (shifted by leg_span_x+10 in X for side-by-side view)
translate([leg_span_x + 10, 0, 0]) {
    legs();
    panels();
    torsion(false);
}
