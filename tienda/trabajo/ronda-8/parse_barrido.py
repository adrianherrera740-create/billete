import re,glob,json
filas=[];term=None;caps=[]
for f in sorted(glob.glob('barrido_*.txt')):
    for l in open(f,encoding='utf-8',errors='replace'):
        l=l.rstrip('\n')
        if l.startswith('### '): term=l[4:]; continue
        if l.strip() in('CAPTCHA',) or l.startswith('ERR'): caps.append(term); continue
        m=re.match(r'- (https\S+) \| ([\d.,]+) € \| (.*?) \| (\S+)★ \| (.*?) \| (.*)$',l)
        if not m: continue
        url,precio,ventas,rat,titulo,tags=m.groups()
        precio=float(precio.replace('.','').replace(',','.')) if ',' in precio else float(precio)
        v=ventas.replace('.','').replace(' vendidos','')
        mm=re.match(r'(\d+)(K?)\+?',v)
        n=0
        if mm: n=int(mm.group(1))*(1000 if mm.group(2) else 1)
        try: r=float(rat)
        except: r=0
        filas.append(dict(term=term,url=url,precio=precio,ventas=n,rating=r,titulo=titulo,tags=tags))
json.dump(filas,open('barrido.json','w'),ensure_ascii=False)
print(len(filas),'fichas; captcha/err en',len(caps),'términos:',caps)
