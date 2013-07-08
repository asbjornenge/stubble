import sys, codecs
import misaka as m

open = codecs.open

base = open('base.html','r',encoding="utf-8").read()
html = m.html(open('README.md',"r",encoding="utf-8").read())

index = open('index.html','w',encoding="utf-8")
index.write(base.replace('__markdown__',html))
