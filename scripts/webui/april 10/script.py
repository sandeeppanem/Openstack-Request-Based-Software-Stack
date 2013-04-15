from bottle import route, run,get, post,request,static_file,template,response
from novaclient.v1_1 import client
import subprocess
import ast
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
flavors=dict()
osnames=dict()


def main():
    global flavors
    global hostname
    global osnames
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    hostname=socket.inet_ntoa(fcntl.ioctl(s.fileno(),0x8915,struct.pack('256s', 'eth0'[:15]))[20:24])
    print(hostname);
    flavors={1:512 ,2:2048,3:4096,4:8192,5:16384}
    osnames={"ubuntu-total-configured":"Ubuntu","fedoraTotalconfigured":"Fedora"}
    
      

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
    i=0
    for key in servers:
        if len(key.addresses['private']) > 1:
            if i==0:
                out={'instance-id': key.id, 'instance-name':key.name, 'status':key.status, 'flavor':key.flavor['id'],'image-id':key.image['id'],'public-ip':key.addresses['private'][1]['addr'],'private-ip':key.addresses['private'][0]['addr']}
            else :
                out=json.dumps(out) + ',' + json.dumps({'instance-id': key.id, 'instance-name':key.name, 'status':key.status, 'flavor':key.flavor['id'],'image-id':key.image['id'],'public-ip':key.addresses['private'][1]['addr'],'private-ip':key.addresses['private'][0]['addr']})
        else :
            if i==0:
                out={'instance-id': key.id, 'instance-name':key.name, 'status':key.status, 'flavor':key.flavor['id'],'image-id':key.image['id'],'public-ip':"",'private-ip':key.addresses['private'][0]['addr']}
            else :
                out=json.dumps(out) + ',' + json.dumps({'instance-id': key.id, 'instance-name':key.name, 'status':key.status, 'flavor':key.flavor['id'],'image-id':key.image['id'],'public-ip':"",'private-ip':key.addresses['private'][0]['addr']})
        i=i+1   
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
    
                
@route('/login',method='POST')
def login_form():
    global nt
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    response.content_type = 'application/json'
    name= request.forms.get('name')
    password = request.forms.get('pass')
    try:
        nt = client.Client(name,password,"admin","http://localhost:5000/v2.0",service_type="compute")
        nt.images.list()
        send = "{ \"status\": 1 }"
        response.content_type = 'application/json'
        return send
    except novaclient.exceptions.Unauthorized as ex:
        send = "{ \"status\": 0 }"
        response.content_type = 'application/json'
        return send
        
  
@route('/vm/create',method='POST')
def vm_create():
    global nt
    global flavors
    global osnames
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    response.content_type = 'application/json'
    get_data=request.forms.get('getdata')
    get_data=ast.literal_eval(get_data)
    for key,value in get_data.iteritems():
        print value
        instance_name=value['instance_name']
        image_name=value['image_name']
        flavor_type=value['flavor_type']
        os_name=osnames[image_name]
        software_list=value['software_list']
        argument=':'.join(software_list)
        argument=os_name+":"+argument
        subprocess.call(['/home/sandeep/sandeep/openstack/scripts/webui.sh',argument])
        im_object=nt.images.find(name=image_name)
        fl_object=nt.flavors.find(ram=flavors[flavor_type])
        for key in nt.keypairs.list():
            key_pair=key.name
    f = open('/home/sandeep/sandeep/openstack/scripts/installerTemp.sh', 'r+')
    nt.servers.create(instance_name,flavor=fl_object,image=im_object,key_name=key_pair,userdata=f)
    send = "{ \"status\": 1 }"
    return send
    
         
@route('/vm/query1')    
def vm_query():
    #x=request.query.get('vmid')
    name="sandeep"
    return template('Hello {{name}}', name=name)    
    

@route('/vm/destroy')
def vm_destroy():
    callback = request.GET.get( 'callback')
    server_name=request.query.get('server_name')
    global nt
    for server in nt.servers.list():
        if server_name==server.name:
            id=server.id
            break
    try:
        server=nt.servers.get(id)
        nt.servers.delete(server)
        send = "{ \"status\": 1 }"
        response.content_type = 'application/json'
        send = callback + '(' + send + ')'
        return send
    except novaclient.exceptions.NotFound as ex:
        print ex
        send = "{ \"status\": 0 }"
        response.content_type = 'application/json'
        send = callback + '(' + send + ')'
        return send


@route('/vm/pause')
def vm_pause():
    callback = request.GET.get( 'callback')
    server_name=request.query.get('server_name')
    global nt
    try:
        for server in nt.servers.list():
            if server_name==server.name:
                server.pause()
                break
        send = "{ \"status\": 1 }"
        response.content_type = 'application/json'
        send = callback + '(' + send + ')'
        return send
    except novaclient.exceptions.NotFound as ex:
        print ex
        send = "{ \"status\": 0 }"
        response.content_type = 'application/json'
        send = callback + '(' + send + ')'
        return send
    
@route('/vm/resume')
def vm_resume():
    callback = request.GET.get( 'callback')
    server_name=request.query.get('server_name')
    global nt
    try:
        for server in nt.servers.list():
            if server_name==server.name:
                server.resume()
                break
        send = "{ \"status\": 1 }"
        response.content_type = 'application/json'
        send = callback + '(' + send + ')'
        return send
    except novaclient.exceptions.NotFound as ex:
        print ex
        send = "{ \"status\": 0 }"
        response.content_type = 'application/json'
        send = callback + '(' + send + ')'
        return send   

@route('/vm/suspend')
def vm_suspend():
    callback = request.GET.get( 'callback')
    server_name=request.query.get('server_name')
    global nt
    try:
        for server in nt.servers.list():
            if server_name==server.name:
                server.suspend()
                break
        send = "{ \"status\": 1 }"
        response.content_type = 'application/json'
        send = callback + '(' + send + ')'
        return send
    except novaclient.exceptions.NotFound as ex:
        print ex
        send = "{ \"status\": 0 }"
        response.content_type = 'application/json'
        send = callback + '(' + send + ')'
        return send
    
        



         
        
    
   
if __name__ == '__main__':
    main()
run(host=hostname, port=8082)
