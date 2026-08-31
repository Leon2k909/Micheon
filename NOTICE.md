# Third-party data

Micheon itself is GPL-3.0 (see [LICENSE](LICENSE)). It bundles the following
third-party data under its own terms.

---

## Spoken word frequencies — `src/data/spokenFrequency.json`

How often each German word is said out loud, used to order the vocabulary
queue. Derived from **FrequencyWords** (`content/2018/de/de_50k.txt`), which is
built from the OpenSubtitles corpus.

- Source: https://github.com/hermitdave/FrequencyWords
- Regenerate with: `node scripts/build-spoken-frequency.cjs <path to de_50k.txt>`

Only the ranks of words this course teaches are kept — 6,314 of the 50,000 —
so what ships is a filtered subset rather than the list itself.

```
MIT License

Copyright (c) 2016 Hermit Dave

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
