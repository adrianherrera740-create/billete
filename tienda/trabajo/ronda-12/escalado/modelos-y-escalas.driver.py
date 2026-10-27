import sys, math, subprocess, re
from argparse import Namespace
sys.path.insert(0, "/home/user/billete/.claude/skills/proveedor-es/scripts")
from margen_es import calcular
import escalado
SC="/home/user/billete/.claude/skills/proveedor-es/scripts/escalado.py"

def m(pvp,coste,envio,emb,dev,com,otros,afil,dias):
    return calcular(Namespace(pvp=pvp,coste=coste,envio=envio,dias_preparacion=dias,dias_entrega=4,embalaje=emb,
        tienda_nueva=False,comision_tiktok=com,otros=otros,afiliado=afil,devoluciones=dev,objetivo=3.0,margen_minimo=0.25))

# modelo: casos (pvp,coste,envio,emb,dev), comision, otros, afil, dias_prep, fijos/mes, inicial, MOQ_uds, cobertura_meses, cap_prov_dia
M = {
 "A":dict(n="A Dropshipping con stock UE",
   cas={"pes":(19.90,9.50,4.50,0.30,0.20),"base":(24.90,8.00,3.90,0.30,0.15),"opt":(29.90,7.00,3.50,0.30,0.10)},
   com=0.09,otros=0.01,afil=0.0,dias=2,fijos=100,ini=150,moq=0,cob=0,cap=40,stock_modo="pedido"),
 "B":dict(n="B Marca propia, stock en 3PL España",
   cas={"pes":(34.90,11.00,5.00,0.80,0.18),"base":(39.90,9.00,4.50,0.80,0.12),"opt":(49.90,8.00,4.20,0.80,0.10)},
   com=0.09,otros=0.01,afil=0.0,dias=1,fijos=250,ini=1000,moq=200,cob=2,cap=150,stock_modo="lote"),
 "C":dict(n="C Print-on-demand UE",
   cas={"pes":(24.90,14.00,4.50,0.0,0.22),"base":(29.90,12.50,4.00,0.0,0.15),"opt":(34.90,11.50,3.80,0.0,0.10)},
   com=0.09,otros=0.01,afil=0.0,dias=3,fijos=100,ini=200,moq=0,cob=0,cap=60,stock_modo="pedido"),
 "D":dict(n="D Producto digital (web propia)",
   cas={"pes":(9.90,0.50,0.0,0.0,0.10),"base":(19.00,0.50,0.0,0.0,0.05),"opt":(29.00,0.50,0.0,0.0,0.05)},
   com=0.0,otros=0.06,afil=0.0,dias=0,fijos=60,ini=100,moq=0,cob=0,cap=9999,stock_modo="pedido"),
}
STAGES=[1000,5000,20000]; CAPS=[500,2000,5000]
out=[]; P=out.append
res={}
for k,d in M.items():
    P(f"\n### Modelo {d['n']}\n")
    P("Economía por pedido (`margen_es.py`, PVP con IVA 21 %%, costes sin IVA, comisión TikTok %.0f %%, otros %.0f %%):\n"%(d['com']*100,d['otros']*100))
    P("| Caso | PVP € | Coste prod. € | Envío € | Embalaje € | Devol. | Beneficio/pedido sin anuncios € | Margen s/base | CPA equilibrio € | Veredicto script |")
    P("|---|---|---|---|---|---|---|---|---|---|")
    r={}
    for c,(pvp,co,en,em,dv) in d['cas'].items():
        x=m(pvp,co,en,em,dv,d['com'],d['otros'],d['afil'],d['dias']); r[c]=x
        P(f"| {c} | {pvp:.2f} | {co:.2f} | {en:.2f} | {em:.2f} | {dv:.0%} | {x['beneficio_por_pedido_sin_anuncios']:.2f} | {x['margen_sobre_base']} | {x['cpa_maximo_para_no_perder']:.2f} | {x['veredicto']} {'; '.join(x['avisos'])} |")
    be=r['base']['beneficio_por_pedido_sin_anuncios']; cpa=round(0.7*be,2)
    # cross-check with escalado.py CLI
    pvp,co,en,em,dv=d['cas']['base']
    b_s0=escalado.unit(pvp,0.0,dv,0.09,d['afil'])
    ce=round(b_s0-be,2)
    cli=subprocess.run(["python3",SC,"--pvp",str(pvp),"--coste",str(ce),"--devoluciones",str(dv),"--cpa",f"{cpa}",
        "--presupuestos","500,1000,2000,5000","--cpa-base",str(cpa),"--capacidad-dia",str(d['cap']),"--fijos",str(d['fijos'])],capture_output=True,text=True).stdout
    mm=re.search(r"· ([\-\d\.]+) € \(comisión 9",cli) or re.search(r"€ \(comisión 4 %, primeros 60 días\) · ([\-\d\.]+) €",cli)
    b9cli=float(re.search(r"días\) · ([\-\d\.]+) € \(comisión 9",cli).group(1))
    ver=re.search(r"\*\*Veredicto: (.*?)\*\*",cli).group(1)
    P(f"\nCPA de partida del modelo = 70 % del CPA de equilibrio base (regla de la puerta 3) = **{cpa:.2f} €**. Contraste con `escalado.py` (coste equivalente {ce:.2f} € para reproducir esta estructura de costes): beneficio/pedido al 9 % = {b9cli:.2f} € frente a {be:.2f} € de `margen_es.py` ({'coincide' if abs(b9cli-be)<0.02 else 'NO COINCIDE'}). Veredicto de `escalado.py` con CPA {cpa:.2f} €, capacidad {d['cap']} pedidos/día y fijos {d['fijos']} €/mes: _{ver}_\n")
    d['cli']=cli; d['cpa']=cpa; d['r']=r; d['ce']=ce
    # stages
    P("Etapas (facturación = ventas con IVA al cliente; TODOS los pedidos pagados con anuncios al CPA de partida, caso conservador; contribución mensual = pedidos × (beneficio/pedido − CPA) − fijos %d €):\n"%d['fijos'])
    P("| Etapa €/mes | Pedidos/mes (base) | Pedidos/día | Anuncios €/mes | Contribución/mes pes / base / opt € | Pedidos/mes para cubrir fijos | Creativos ganadores (supuesto 8 pedidos/día c/u) | Capacidad proveedor |")
    P("|---|---|---|---|---|---|---|---|")
    for R in STAGES:
        ped=R/pvp; dia=ped/30; ads=ped*cpa
        cs=[]
        for c in ("pes","base","opt"):
            pv=d['cas'][c][0]; pc=R/pv; b=r[c]['beneficio_por_pedido_sin_anuncios']
            cs.append(pc*(b-cpa)-d['fijos'])
        cubrir=d['fijos']/(be-cpa)
        cre=max(1,math.ceil(dia/8))
        P(f"| {R:,} | {ped:.0f} | {dia:.1f} | {ads:.0f} | {cs[0]:+.0f} / {cs[1]:+.0f} / {cs[2]:+.0f} | {cubrir:.0f} | {cre} | {'OK' if dia<=d['cap'] else 'SUPERA'} ({d['cap']}/día supuesto) |")
    P("")
    # cash matrix
    P("Caja necesaria = stock + capital atrapado (fórmula de `escalado.py`: pedidos/día × coste × 14 días de retraso de cobro) + 1 semana de anuncios + 1 mes de fijos + inversión inicial única (%d €, supuesto):\n"%d['ini'])
    P("| Etapa €/mes | Inversión en stock € | Capital atrapado € | Caja necesaria € | Ticket medio € | Cabe con 500 € | Cabe con 2.000 € | Cabe con 5.000 € |")
    P("|---|---|---|---|---|---|---|---|")
    for R in STAGES:
        ped=R/pvp; dia=ped/30; ads=ped*cpa
        if d['stock_modo']=="lote":
            uds=max(d['moq'],ped*d['cob']); stock=uds*co
            atr=dia*(en+em)*14
        else:
            stock=0; atr=dia*(co+en)*14
        caja=stock+atr+ads*7/30+d['fijos']+d['ini']
        flags=[]
        for C in CAPS:
            st="SÍ" if caja<=C else f"NO (faltan {caja-C:,.0f})"
            if caja<=C and be-cpa<=0: st="NO (pierde)"
            flags.append(st)
        d.setdefault('cells',{})[R]=(caja,stock,flags)
        P(f"| {R:,} | {stock:,.0f} | {atr:,.0f} | {caja:,.0f} | {pvp:.2f} | "+" | ".join(flags)+" |")
    P("")
open("/tmp/claude-0/-home-user-billete/40847db3-03d2-51f9-a366-557bc974ff91/scratchpad/body.md","w").write("\n".join(out))
# master matrix
mm=[]
mm.append("| Modelo | Capital | Etapa 1.000 | Etapa 5.000 | Etapa 20.000 |"); mm.append("|---|---|---|---|---|")
for k,d in M.items():
    for i,C in enumerate(CAPS):
        row=[]
        for R in STAGES:
            caja,stock,fl=d['cells'][R]; row.append(f"{fl[i].split(' ')[0]} · caja {caja:,.0f}")
        mm.append(f"| {k} | {C:,} € | "+" | ".join(row)+" |")
open("/tmp/claude-0/-home-user-billete/40847db3-03d2-51f9-a366-557bc974ff91/scratchpad/master.md","w").write("\n".join(mm))
for k,d in M.items():
    open(f"/tmp/claude-0/-home-user-billete/40847db3-03d2-51f9-a366-557bc974ff91/scratchpad/cli_{k}.txt","w").write(d['cli'])
print("\n".join(mm)); print("\n".join(out))
