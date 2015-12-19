(function ($) {
	console.log("Attaching behaviour");
	Drupal.behaviors.chemdoodle = {
	    attach: function (context, settings) {
			$("canvas.chemdoodle").each(function(i) {
				var fPath = $(this).data("source");
				var style = $(this).data("render-style");
				if( !$(this).attr('id')) {
					$(this).attr('id', "chemdoodle-"+i);
				}
				var jquery_canvas = $(this);
				var render_map = {
					'mol': {'read':ChemDoodle.readMOL},
					'cml': {'read':ChemDoodle.readCML}
				};
				var data_type = $(this).data("type");
				try {
					var reader = render_map[data_type].read;
				}
				catch (e if e instanceof(TypeError)) {
					return;
				}

				ChemDoodle.io.file.content(fPath, function(fileContent) {
				    switch(style) {
				    	case '2D':
						    var canvas = new ChemDoodle.ViewerCanvas(jquery_canvas.attr('id'), 800, 400);
							//the width of the bonds should be .6 pixels
							canvas.specs.bonds_width_2D = .6;
							//the spacing between higher order bond lines should be 18% of the length of the bond
							canvas.specs.bonds_saturationWidth_2D = .18;
							//the hashed wedge spacing should be 2.5 pixels
							canvas.specs.bonds_hashSpacing_2D = 2.5;
							//the atom label font size should be 10
							canvas.specs.atoms_font_size_2D = 10;
							//we define a cascade of acceptable font families
							//if Helvetica is not found, Arial will be used
							canvas.specs.atoms_font_families_2D = ['Helvetica', 'Arial', 'sans-serif'];
							//display carbons labels if they are terminal
							canvas.specs.atoms_displayTerminalCarbonLabels_2D = true;
							//add some color by using JMol colors for elements
							canvas.specs.atoms_useJMOLColors = false;
							canvas.emptyMessage = 'No Data Loaded!';
							var mol = reader(fileContent);
							break;
						case '3D':
							var canvas = new ChemDoodle.TransformCanvas3D(jquery_canvas.attr('id'), 800, 250);
							canvas.specs.set3DRepresentation('Ball and Stick');
							canvas.specs.backgroundColor = 'black';
							var mol = reader(fileContent, 1);
							break;
					}
					switch(data_type) {
						case 'mol':
							mol.scaleToAverageBondLength(14.4);
							canvas.loadMolecule(mol);
							break;
						default:
							canvas.loadContent(mol);
					}

				});	
			});
	    }
  	};
})(jQuery);