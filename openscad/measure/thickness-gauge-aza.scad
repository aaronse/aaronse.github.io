// 99% based on @sponno_2422409 work at https://www.printables.com/model/1033945-thickness-gauge-ruler-1-20mm-in-1mm-increments-100/files

// MOD HISTORY:
// 2025-08-12 @AzaB2C
// - Increased font size and tweaked layout to maximize readability.

step = 10;

difference() {
    union() {
        for(i = [1:1:10]){
            //echo(i);
            // Create the cube with debossed text on both sides
            translate([(i-1)*step, 0, 0])
            difference() {
                // The cube
                cube([step, 10+(i), i]);
                offset = (i == 10) ? 6 : 4; // move the 10 slighly left when 
               
                // Front face: deboss 'i mm'
                
                translate(
                  (i == 10)
                  ? [step/2 - 2, offset + 2.5, i-0.6]
                  : [step/2 - 2, offset + .5, i-0.6],
                [step/2 - 2, offset, i-1.5])  // Adjust Z position slightly inside the cube
                rotate([0, 0, -90])  // Rotate the text 90º clockwise (around the z-axis)
                linear_extrude(height=1.5)  // Extrude deeper to ensure the text is fully subtracted
                text(str(i, ""), size=5, valign="right", halign="lef", font="Bitstream Vera Sans"); // Debossed text

                // Front face: deboss 'i mm'
                translate([step/2-4, 6+i-2, i-0.6])  // Adjust Z position slightly inside the cube
                rotate([0, 0, 0])  // Rotate the text 90º clockwise (around the z-axis)
                linear_extrude(height=1.5)  // Extrude deeper to ensure the text is fully subtracted
                text(str(i+10, ""), size=5,  valign="bottom", halign="middle", font="Bitstream Vera Sans"); // Debossed text
                
                line = 0.2;
                depth=0.4;
                translate([2-line,0,0]) cube([line,depth,2]); // 2
                translate([4-line,0,0]) cube([line,depth,2]); // 4
                translate([6-line,0,0]) cube([line,depth,2]); // 6
                translate([8-line,0,0]) cube([line,depth,2]); // 8
                translate([10-line,0,0]) cube([line,depth,10]); //10
            }
        }
    }
    // A cylinder
    translate([step*10-4, 10, 0])
    cylinder(20, 3);
    
    // Add text on the ZX plane: "DX HEIGHT GAUGE"
    //translate([73, 0.5,2.5 ])  // Adjust translation to position the text on the ZX plane
    //rotate([90, 0, 0])  // Rotate the text so it appears flat on the ZX plane
    //linear_extrude(height=1.5)  // Extrude the text to make it visible
    // Text to be displayed on the ZX plane
    //text("THICKNESS GAUGE MK2", size=3, valign="center", halign="center");
    
}

