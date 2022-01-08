from flask import Flask, render_template, request
import os
import shutil
import re
from os import path

app = Flask(__name__)

number_cam = ''

def sorted(elem):
    return elem[2]

@app.route('/cam')
def cam():
    array = []
    entries = os.listdir('/Users/chengyangli/flask/frontend/public/masks_ut_rgba')
    for entry in entries:
        if entry == '.DS_Store':
            continue
        array.append(entry)
    array.sort()
    return {"cam": array}

@app.route('/members')
def members():
    # data = request.get_json()
    # print(data['content'])
    # cam = data['content']
    print(number_cam)
    array = []
    i = 0
    for path, subdirs, files in os.walk('/Users/chengyangli/flask/frontend/public/masks_ut_rgba/' + number_cam):
        arr = []
        arr.append(files)
        arr.insert(0, path.replace('/Users/chengyangli/flask/frontend/public/', ''))
        if(i == 0):
            i=i+1
        else:
            # print('path:'+path)
            arr.append(int(path.replace('/Users/chengyangli/flask/frontend/public/masks_ut_rgba/' + number_cam + '/', '')))
        array.append(arr)
    array.pop(0)
    array.sort(key=sorted)
    array.sort()
    print(array)
    return {"members": array}

@app.route('/api/getCam', methods=['POST'])
def getCam():
    global number_cam
    data = request.get_json()
    number_cam = data['content']
    return 'success'

@app.route('/api/delete', methods=['POST'])
def delete():
    data = request.get_json()
    # print(data['content'][0])
    default_path = '/Users/chengyangli/flask/frontend/public/'
    # first select will be end
    # data['content'] = ['masks_ut_rgba/cam0/1', 'masks_ut_rgba/cam0/3', 'masks_ut_rgba/cam0/5']
    target_dir = '/Users/chengyangli/flask/frontend/public/deleted/'
    # source_dir = ['masks_ut_rgba/cam0/3', 'masks_ut_rgba/cam0/5']]
    source_dir_list = data['content'][0:]
    for source_dir in source_dir_list:
        source_dir = default_path + source_dir
        file_names = os.listdir(source_dir)
        for file_name in file_names:
            shutil.move(os.path.join(source_dir, file_name), target_dir)
        os.rmdir(source_dir)
    return 'success'

@app.route('/api/merge', methods=['POST'])
def merge():
    data = request.get_json()
    # print(data['content'][0])
    default_path = '/Users/chengyangli/flask/frontend/public/'
    # first select will be end
    # data['content'] = ['masks_ut_rgba/cam0/1', 'masks_ut_rgba/cam0/3', 'masks_ut_rgba/cam0/5']
    target_dir = default_path + data['content'][0]
    # source_dir = ['masks_ut_rgba/cam0/3', 'masks_ut_rgba/cam0/5']]
    source_dir_list = data['content'][1:]
    for source_dir in source_dir_list:
        source_dir = default_path + source_dir
        file_names = os.listdir(source_dir)
        for file_name in file_names:
            shutil.move(os.path.join(source_dir, file_name), target_dir)
        os.rmdir(source_dir)
    return 'success'

@app.route('/split', methods=['POST'])
def split():
    data = request.get_json()
    default_path = '/Users/chengyangli/flask/frontend/public/'
    # print("data: ", data['content'][0])
    # ['masks_ut_rgba/cam0/5///1629266502.8616345.png', 'masks_ut_rgba/cam0/5///1629266502.4534564.png', 'masks_ut_rgba/cam0/5///1629266503.1987114.png']
    path_search = re.search('(.+?)///', data['content'][0])
    # print("file_path: ", path_search )
    # Checking if file is empty. If so, prevent splitting.
    if path_search :
        file_location = path_search.group(0).replace("///", '')
        print("file_location: ", file_location)
    file_path = default_path + file_location
    path_1, dirs, files = next(os.walk(file_path))
    file_count = len(files)
    print("file_count: ",file_count)
    if file_count == 1:
        print("empty")
        return "failed"
    new_cam_num = re.search('cam(.+?)', data['content'][0])
    # print("new_cam_num: ", new_cam_num)
    if new_cam_num:
        found_cam_num = new_cam_num.group(0)
        # print("found_cam_num: ", found_cam_num)
    new_id = re.search(found_cam_num + '/(.+?)///', data['content'][0])
    # print("new_id: ", new_id)
    if new_id:
        found = new_id.group(1) 
        # print("found: ", found)
        # found: 5 <string>
    new_id = int(found)
    while path.isdir("/Users/chengyangli/flask/frontend/public/masks_ut_rgba/" + found_cam_num +"/" + str(new_id)):
        new_id = int(new_id) + 1
    new_dir = default_path + data['content'][0][0:19] + str(new_id)
    os.mkdir(new_dir)
    target_dir = new_dir
    source_dir_sub = re.search('(.+?)///', data['content'][0])
    if source_dir_sub:
        source_dir_sub = source_dir_sub.group(1) 
    source_dir = default_path + source_dir_sub
    # print('source_dir: ', source_dir)
    file_names = data['content']
    # print('file_names: ', file_names)
    for file_name in file_names:
        file_name = re.search('///(.+)', file_name)
        if file_name:
            file_name = file_name.group(1)
        shutil.move(os.path.join(source_dir, file_name), target_dir)
    return 'success'

if __name__ == "__main__":
    app.run(debug=True)
