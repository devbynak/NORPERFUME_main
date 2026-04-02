import glob
import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# Extract the <nav class="navbar" id="navbar">...</nav>
nav_match = re.search(r'(<nav class="navbar" id="navbar">.*?</nav>)', index_html, re.DOTALL)
if not nav_match:
    print("nav not found in index.html")
    exit(1)

nav_html = nav_match.group(1)

for file in glob.glob('public/*.html'):
    if file == 'public/index.html':
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace existing nav
    new_content = re.sub(r'<nav class="navbar" id="navbar">.*?</nav>', nav_html, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")

