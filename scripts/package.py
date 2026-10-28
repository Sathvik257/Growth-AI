"""Build the portable demo and project archive from the current source."""
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
DOWNLOADS = PUBLIC / 'downloads'
html = (PUBLIC / 'index.html').read_text(encoding='utf-8-sig')
css = (PUBLIC / 'style.css').read_text(encoding='utf-8-sig')
css = re.sub(r'@import\s+url\([^;]+;', '', css)
html = re.sub(r'<article id="submission">.*?</article>', '', html, flags=re.S)
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')
for filename in ['app.js', 'operations.js']:
    js = (PUBLIC / filename).read_text(encoding='utf-8-sig')
    if filename == 'app.js':
        js = js.replace("'campus-relay-v1'", "'campus-relay-portable-v1'")
    html = html.replace(f'<script src="{filename}"></script>', '<script>' + js + '</script>')
(DOWNLOADS / 'Campus-Relay-Portable.html').write_text(html.rstrip() + '\n', encoding='utf-8')

files = [ROOT / 'README.md', ROOT / 'vercel.json', ROOT / 'scripts/package.py']
files += list((ROOT / 'tests').glob('*.test.cjs'))
files += list((ROOT / '.github/workflows').glob('*.yml'))
files += [PUBLIC / f for f in ['index.html', 'style.css', 'app.js', 'operations.js']]
files += list((PUBLIC / 'assets').glob('*.png'))
files += [DOWNLOADS / f for f in [
    'Growth-Plan.pdf', 'AI-LEARNING-NOTES.md', 'CAMPAIGN-COPY.md',
    'DEMO-GUIDE.md', 'VIDEO-SCRIPT.md', 'Campus-Relay-Walkthrough.mp4',
    'Campus-Relay-Portable.html'
]]
archive = DOWNLOADS / 'Submission-Package.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
    for file in files:
        z.write(file, file.relative_to(ROOT))
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert z.read('public/app.js') == (PUBLIC / 'app.js').read_bytes()
print(f'Built portable demo and verified archive with {len(files)} files.')
