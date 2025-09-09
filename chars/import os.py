import os
import xml.etree.ElementTree as ET

def add_preserve_aspect_ratio(folder_path):
    for filename in os.listdir(folder_path):
        if filename.endswith(".svg"):
            file_path = os.path.join(folder_path, filename)
            
            # Parse the SVG file
            tree = ET.parse(file_path)
            root = tree.getroot()
            
            # Check if the root tag is <svg>
            if root.tag == "{http://www.w3.org/2000/svg}svg":
                # Add preserveAspectRatio="none" if not already present
                if "preserveAspectRatio" not in root.attrib:
                    root.set("preserveAspectRatio", "none")
                
                # Write the changes back to the file
                tree.write(file_path, encoding="utf-8", xml_declaration=True)
                print(f"Updated: {filename}")

# Specify the folder containing SVG files
folder_path = "/path/to/your/svg/folder"
add_preserve_aspect_ratio(folder_path)