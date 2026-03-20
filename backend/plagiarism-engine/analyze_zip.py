import sys
import json
import zipfile
import re
import os

def analyze_zip(zip_path):
    result = {
        "techStack": [],
        "description": "Auto-AI Description: This project contains ",
    }
    
    try:
        if not os.path.exists(zip_path):
            result["error"] = "File not found"
            print(json.dumps(result))
            return

        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            file_names = zip_ref.namelist()
            file_count = len(file_names)
            
            # Identify Tech Stack from File Extensions
            techs = set()
            for f in file_names:
                ext = f.lower().split('.')[-1] if '.' in f else ''
                if ext in ['js', 'jsx', 'ts', 'tsx']: techs.add("React/NodeJS")
                elif ext == 'py': techs.add("Python")
                elif ext == 'java': techs.add("Java")
                elif ext == 'php': techs.add("PHP")
                elif ext == 'html': techs.add("HTML/CSS")
                elif ext == 'sol': techs.add("Blockchain (Solidity)")
                elif f.endswith('package.json'): techs.add("NodeJS Dependency File")
                elif f.endswith('requirements.txt'): techs.add("Python Dependency File")
                elif f.endswith('pom.xml'): techs.add("Java Maven")
            
            stack_str = ", ".join(list(techs)) if techs else "General Coding"
            
            # Generate Description
            desc = f"Wait... AI is analyzing {file_count} files.\n\n"
            desc += f"Based on the structure, this is a **{stack_str}** project.\n"
            desc += f"It includes {file_count} source files. "
            
            if "React/NodeJS" in techs:
                desc += "The project structure suggests a modern Web Application using Component Architecture. "
            if "Python" in techs:
                desc += "It likely contains AI/ML scripts or Backend logic. "
            if "Blockchain" in techs:
                desc += "Smart Contracts detected for decentralized applications. "

            desc += "\n\nKey Files Detected:\n" + ", ".join(file_names[:5]) + "..."
            
            result["techStack"] = stack_str
            result["description"] = desc
            result["fileCount"] = file_count
            
            # Simple complexity Score (1-10)
            score = 1
            if file_count > 50: score = 8
            elif file_count > 20: score = 5
            elif file_count > 10: score = 3
            
            if "Python" in techs or "Java" in techs: score += 1
            if "Blockchain" in techs: score += 2
            
            result["complexityScore"] = min(score, 10)

    except Exception as e:
        result["error"] = str(e)

    print(json.dumps(result))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # sys.argv[1] is the absolute path to zip file
        analyze_zip(sys.argv[1])
    else:
        print(json.dumps({"error": "No file provided"}))
