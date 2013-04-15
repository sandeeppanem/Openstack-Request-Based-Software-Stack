from bottle import route, run,get, post,request,static_file,template,response
from novaclient.v1_1 import client
import json
import novaclient
import bottle
import socket
import fcntl
import struct
from xml.dom.minidom import parseString
import xml.etree.cElementTree as ET
import sys
import socket
import libvirt
import os
from collections import defaultdict
counter=3800
pm_vm_mapping=defaultdict(list)
vmid_dmid_mapping=dict()
vm_type_mapping=dict()
images=dict()
imagepaths=dict()
pms=dict()
instance_types=dict()
str3=dict()
str2=dict(dict())
pmid_conn_mapping=dict()
wholepath=dict()
hostname=None
nt=None
@route('/static/:path#.+#', name='static')
def server_static(path):
    return static_file(path, root='static')




def main():
    
    global hostname
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    hostname=socket.inet_ntoa(fcntl.ioctl(s.fileno(),0x8915,struct.pack('256s', 'eth0'[:15]))[20:24])
    print(hostname);           
      

@route('/image/list')
def list_images():
    callback = request.GET.get( 'callback')
    global nt
    images=nt.images.list()   
    out = [{'id': key.id, 'name':key.name} for key in images]
    response.content_type = 'application/json'
    rv=json.dumps({'images':out})
    send=callback + '(' + rv + ')'
    return  send
    
@route('/instances/list')
def list_instances():
    callback = request.GET.get( 'callback')
    global nt
    servers=nt.servers.list()    
    out=[{'instance-id': key.id, 'instance-name':key.name, 'status':key.status, 'flavor':key.flavor['id'],'image-id':key.image['id'],'public-ip':key.addresses['private'][1]['addr'],'private-ip':key.addresses['private'][0]['addr']} for key in servers]
    response.content_type = 'application/json'
    rv=json.dumps({'servers':out})
    send=callback + '(' + rv + ')'
    return send
 
@route('/flavor/types')
def list_types():
    callback = request.GET.get( 'callback')
    global nt
    flavors=nt.flavors.list()
    out = [{'flavor-id': key.id, 'flavor-name':key.name,'ram':key.ram,'vcpus':key.vcpus,'disk':key.disk} for key in flavors]
    rv=json.dumps({'flavors':out})
    response.content_type = 'application/json'
    send = callback + '(' + rv + ')'
    return send
    
@get('/login') # or @route('/login')
def login_form():
    return '''<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>SRV</title>
<link rel="stylesheet" href="/static/style.css" type="text/css">
<link rel="stylesheet" href="/static/login.css" type="text/css">
<script src="/static/jquery.js" type="text/javascript"></script>
<script src="/static/jquery.blockUI.js" type="text/javascript"></script>
<script src="/static/jquery-1.8.2.min.js" type="text/javascript"></script>
</head>
<body>
<div id=headerWrapper>
	<div id="header">
		<div id="headerTitles">
		<h1>
		<a href="#">SOFTWARE STACK</a>
		</h1>
		</div>
	</div>
</div>

<div id="bgNode">
<br/><br/>
<div class="hidden" id="loading-image" style="margin-left:470px"><img src="static/ajax-loader.gif"></div>
<br/><br/>
<div>
		<div class="grid16">
				<form method="POST" action="/login">
                <input name="username"     type="text" />
                <input name="password" type="password" />
                <input type="submit" name="LOGIN" value="LOGIN"/>
              </form>
			</div>
	</div>

<div id="success"></div>
</div>

</body>
</html> '''
                
@route('/login',method='POST')
def login_form():
    
    response.content_type = 'application/json'
    #callback = request.GET.get( 'callback')
    
    name= request.forms.get('username')
    password= request.forms.get('password')
    
    
    try:
        nt = client.Client(name,password,"admin","http://localhost:5000/v2.0",service_type="compute")
        nt.images.list()
        send = "{ \"status\": 1 }"
        response.content_type = 'application/json'
        sendcall = '(' + send + ')'
        return sendcall
    except novaclient.exceptions.Unauthorized as ex:
        send = "{ \"status\": 0 }"
        response.content_type = 'application/json'
        sendcall = '(' + send + ')'
        return sendcall
        
  
    
   
    
    

@route('/pm/<pmid>')
def pm_query(pmid):
    global pms
    pmid=int(pmid)
    conn=pmid_conn_mapping.get(pmid)
    type1=conn.getType()
    numcpus=conn.getMaxVcpus(type1)
    freemem=conn.getFreeMemory()/(1024.0*1024.0*1024)*8
    host=pms.get(pmid)
    totaldisk=os.popen('ssh '+host+' df -h | grep "^/dev/[hs]d" | awk "{s+=\$2} END {print s}"').read()
    freedisk=os.popen('ssh '+host+' df -h | grep "^/dev/[hs]d" | awk "{s+=\$4} END {print s}"').read()
    totaldisk=totaldisk.rstrip()+"GB"
    freedisk=freedisk.rstrip()+"GB"
    #print "free memory:%f GB" % num
    nodeinfo=conn.getInfo()
    s=nodeinfo.pop(2)
    acpus=int(s)
    #print "Total active cpus are %d" % p
    cpu=0
    domains=0
    for id in conn.listDomainsID():
        domains+=1
        dom = conn.lookupByID(id)
        info=dom.info()
        s=info.pop(3)
        cpu+=int(s)
    freecpus=numcpus-cpu
    #print "Number of free cpus are %d" % (acpus-cpu)
    s=nodeinfo.pop(1)
    totalmem=(float(s)/1024.0)
    #print "total memory is %f GB" % (p/(1024.0))
    #print "Num of virtual machines:%d" % domains
    out=[{'pmid':pmid,'capacity':{'cpu':numcpus,'ram':totalmem,'disk':totaldisk},'free':{'cpu':freecpus,'ram':freemem,'disk':freedisk},'vms':domains}]
    return {'pmid':out}
         
@route('/vm/query1')    
def vm_query():
    #x=request.query.get('vmid')
    name="sandeep"
    return template('Hello {{name}}', name=name)    
    

@route('/vm/destroy')
def vm_destroy():
    vmid=request.query.get('vmid')
    global pm_vm_mapping
    global vmid_dmid_mapping
    #obtain pmid based on vmid and get ssh connection to the particular host
    vmid=int(vmid)
    for key,values in pm_vm_mapping.iteritems():
        for i in values:
            if i==vmid:
                pmid=key
                values.remove(vmid)
                break
        break
        
            
    conn=pmid_conn_mapping.get(pmid)
    for key,values in vmid_dmid_mapping.iteritems():
        if key==vmid:
            x=values
            del vmid_dmid_mapping[key]
            break
    dom=conn.lookupByID(x)
    check=dom.destroy()
    if(check==0):
        return {"status": 1}
    else:
        return {"status": 0}


    


    
        
@route('/vm/create')
def vm_create():
    name =request.query.get('name')
    vm_type=request.query.get('vm_type')
    image_type=request.query.get('image_type')
    global counter
    global pm_vm_mapping
    global vmid_dmid_mapping
    global vm_type_mapping
    global pmid_conn_mapping
    vm_type=int(vm_type)
    image_type=int(image_type)
    memory1=int(instance_types.values()[vm_type-1])*1000
    vcpu1=instance_types.keys()[vm_type-1]
    machine_id=scheduler(memory1,vcpu1)
    conn=pmid_conn_mapping.get(machine_id)
                
    #get image from image list
    #get ram and vcpu from intstance list
    #den creating xml
    #den create domain on which ever machine its available
    
    
    
    xml=conn.getCapabilities()
    image_path="/var/lib/libvirt/images/"
    image_name=images.get(image_type)
    
    name1=name
    type1=conn.getType()
    if (type1=="xen"):
        dev1='xvdd'
        bus='xen'
        dname='tap'
        dtype='qcow'
    else:
        dev1="hda"
        bus='ide'
        dname='qemu'
        dtype='raw'
    dom = parseString(xml)
    arch = dom.getElementsByTagName('arch')[0].firstChild.data
    emulator=dom.getElementsByTagName('emulator')[0].firstChild.data
    os_type= dom.getElementsByTagName('os_type')[0].firstChild.data
    machine=dom.getElementsByTagName('machine')[0].firstChild.data
    vm_createxml(name1,memory1,vcpu1,image_name,type1,arch,emulator,os_type,image_path,dev1,bus,dname,dtype,machine)
    filename="filename.xml"
    f=open(filename,'r')
    xmlconfig=f.read()

    dom=conn.createXML(xmlconfig,0)
    id=dom.ID()
    pm_vm_mapping[machine_id].append(counter)
    vmid_dmid_mapping.update({counter:id})
    vm_type_mapping.update({counter:vm_type})
    counter+=1
    return {"vmid" : (counter-1)}

def vm_createxml(name1,memory1,vcpu1,image_name,type1,arch,emulator,os_type,image_path,dev1,bus,dname,dtype,machine):
    
    
    memory1=str(memory1)
    vcpu1=str(vcpu1)
    type1=str(type1)
    type1=type1.lower()

    
    domain = ET.Element("domain")
    domain.set("type",type1)

    name = ET.SubElement(domain, "name")
    name.text=name1
    memory = ET.SubElement(domain, "memory")
    memory.text=memory1
    vcpu = ET.SubElement(domain, "vcpu")
    vcpu.text=vcpu1
    if (type1=='xen'):
        bootloader=ET.SubElement(domain, "bootloader")
        bootloader.text='/usr/bin/pygrub'
    os = ET.SubElement(domain, "os")
    type1=ET.SubElement(os, "type")
    type1.set("arch",arch)
    type1.set("machine",machine)
    type1.text=os_type
    if (type1=='qemu'):
        boot=ET.SubElement(os, "boot")
        boot.set("dev","hd")
        
    features = ET.SubElement(domain, "features")
    acpi = ET.SubElement(features, "acpi")
    apic = ET.SubElement(features, "apic")
    pae = ET.SubElement(features, "pae")
    on_poweroff = ET.SubElement(domain, "on_poweroff")
    on_poweroff.text="destroy"
    on_reboot = ET.SubElement(domain, "on_reboot")
    on_reboot.text="restart"
    on_crash = ET.SubElement(domain, "on_crash")
    on_crash.text="restart"
    devices = ET.SubElement(domain, "devices")
    emulator = ET.SubElement(devices, "emulator")
    emulator.text=emulator
    disk = ET.SubElement(devices, "disk")
    disk.set("type","file")
    disk.set("device","disk")
    driver = ET.SubElement(disk, "driver")
    driver.set("name",dname)
    driver.set("type",dtype)
    source = ET.SubElement(disk, "source")
    source.set("file",image_path+image_name)
    target = ET.SubElement(disk, "target")
    target.set("dev",dev1)
    target.set("bus",bus)
    address = ET.SubElement(disk, "address")
    address.set("type","drive")
    address.set("controller","0")
    address.set("bus","0")
    address.set("unit","0")

    tree = ET.ElementTree(domain)
    tree.write("filename.xml")

def scheduler(memory1,vcpu1):
    memory1=(memory1/1000)/1024.0
    pm_mem=dict()
    cpu=0
    global pmid_conn_mapping
    j=1
    for i,v in pmid_conn_mapping.iteritems():
        freemem=v.getFreeMemory()/(1024.0*1024.0*1024)*8
        type1=v.getType()
        numcpus=v.getMaxVcpus(type1)
        for id in v.listDomainsID():
            dom = v.lookupByID(id)
            info=dom.info()
            s=info.pop(3)
            cpu+=int(s)
        freecpus=numcpus-cpu
        if (freemem>=memory1 and freecpus>=vcpu1):
            hash1=(freemem-memory1)+(freecpus-vcpu1)
            pm_mem.update({j:hash1})
            j+=1
    list_sorted= sorted(pm_mem,key=pm_mem.get)
    return list_sorted[0]
    
         
        
    
   
if __name__ == '__main__':
    main()
run(host=hostname, port=8082)

