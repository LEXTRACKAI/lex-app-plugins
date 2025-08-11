import psutil, time, os
from datetime import datetime

start = time.time()
ERR_LOG="app_error.log"

def status():
    s = any("uvicorn" in p.name().lower() for p in psutil.process_iter())
    t = any("streamlit" in p.name().lower() for p in psutil.process_iter())
    return "Running" if s and t else "Partial" if s or t else "Stopped"

def uptime():
    secs=int(time.time()-start)
    return datetime.utcfromtimestamp(secs).strftime("%H:%M:%S")

def cpu_mem():
    return psutil.cpu_percent(1), psutil.virtual_memory().percent

def err_count():
    return len(open(ERR_LOG).readlines()) if os.path.exists(ERR_LOG) else 0

def health_score(st, cpu, mem, ec):
    score=100
    if st!="Running": score-=40
    if cpu>80: score-=20
    if mem>80: score-=20
    if ec>0: score-=10
    return max(score,0)

if __name__=="__main__":
    st=status(); ut=uptime(); c,m=cpu_mem(); e=err_count()
    hs=health_score(st,c,m,e)
    print("\n📊 App Health Metrics\n"+"="*25)
    print(f"Status       : {st}")
    print(f"Uptime       : {ut}")
    print(f"CPU Usage    : {c}%")
    print(f"Mem Usage    : {m}%")
    print(f"Error Count  : {e}")
    print(f"Health Score : {hs}/100")
    print("="*25+"\n")