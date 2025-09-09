#!/usr/bin/env python3
"""
Script to add preserveAspectRatio="none" to all SVG files in the current directory.
This script will:
1. Find all .svg files in the current directory
2. Check if they already have preserveAspectRatio attribute
3. Add preserveAspectRatio="none" to the svg tag if not present
4. Preserve the original file structure and formatting
"""

import os
import re
import glob

def update_svg_file(file_path):
    """Update a single SVG file to add preserveAspectRatio="none" if not present."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Check if preserveAspectRatio is already present
        if 'preserveAspectRatio=' in content:
            print(f"✓ {os.path.basename(file_path)} already has preserveAspectRatio attribute")
            return False
        
        # Find the svg tag and add preserveAspectRatio="none"
        # Pattern to match the opening svg tag
        svg_pattern = r'(<svg[^>]*?)(\s*>)'
        
        def replace_svg_tag(match):
            svg_attributes = match.group(1)
            closing_bracket = match.group(2)
            # Add preserveAspectRatio="none" before the closing bracket
            return f'{svg_attributes} preserveAspectRatio="none"{closing_bracket}'
        
        updated_content = re.sub(svg_pattern, replace_svg_tag, content)
        
        # Only write if content changed
        if updated_content != content:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(updated_content)
            print(f"✓ Updated {os.path.basename(file_path)}")
            return True
        else:
            print(f"⚠ No changes made to {os.path.basename(file_path)}")
            return False
            
    except Exception as e:
        print(f"✗ Error processing {os.path.basename(file_path)}: {e}")
        return False

def main():
    """Main function to process all SVG files."""
    # Get current directory
    current_dir = os.getcwd()
    print(f"Processing SVG files in: {current_dir}")
    print("-" * 50)
    
    # Find all SVG files
    svg_files = glob.glob("*.svg")
    
    if not svg_files:
        print("No SVG files found in the current directory.")
        return
    
    print(f"Found {len(svg_files)} SVG files")
    print("-" * 50)
    
    updated_count = 0
    already_has_count = 0
    error_count = 0
    
    for svg_file in sorted(svg_files):
        result = update_svg_file(svg_file)
        if result is True:
            updated_count += 1
        elif result is False:
            already_has_count += 1
        else:
            error_count += 1
    
    print("-" * 50)
    print(f"Summary:")
    print(f"  Updated: {updated_count} files")
    print(f"  Already had preserveAspectRatio: {already_has_count} files")
    print(f"  Errors: {error_count} files")
    print(f"  Total processed: {len(svg_files)} files")

if __name__ == "__main__":
    main()

