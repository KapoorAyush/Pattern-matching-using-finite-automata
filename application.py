from flask import Flask, request, jsonify
from flask import send_from_directory

import uuid

NO_OF_CHARS = 256


def getNextState(pat, M, state, x):
    ''' 
    calculate the next state  
    '''

    # If the character c is same as next character  
    # in pattern, then simply increment state

    if state < M and x == ord(pat[state]):
        return state + 1

    i = 0
    # ns stores the result which is next state 

    # ns finally contains the longest prefix  
    # which is also suffix in "pat[0..state-1]c"

    # Start from the largest possible value and
    # stop when you find a prefix which is also suffix
    for ns in range(state, 0, -1):
        if ord(pat[ns - 1]) == x:
            while (i < ns - 1):
                if pat[i] != pat[state - ns + 1 + i]:
                    break
                i += 1
            if i == ns - 1:
                return ns
    return 0


def computeTF(pat, M):
    ''' 
    This function builds the TF table which  
    represents Finite Automata for a given pattern 
    '''
    global NO_OF_CHARS

    TF = [[0 for _ in range(NO_OF_CHARS)] for _ in range(M + 1)]
    for state in range(M + 1):
        for x in range(NO_OF_CHARS):
            z = getNextState(pat, M, state, x)
            TF[state][x] = z

    return TF


def search(pat, txt):
    ''' 
    Prints all occurrences of pat in txt 
    '''
    global NO_OF_CHARS
    M = len(pat)
    N = len(txt)
    TF = computeTF(pat, M)
    locations=[]
    # Process txt over FA. 
    state = 0
    for i in range(N):
        state = TF[state][ord(txt[i])]
        if state == M:
            print("Pattern found at index: {}". format(i - M + 1))
            locations.append(i-M+1)
        # Driver program to test above function
    return locations

app = Flask(__name__)

@app.route('/', methods=['GET'])
def send_index():
    return send_from_directory('./www', "index.html")

@app.route('/<path:path>', methods=['GET'])
def send_root(path):
    return send_from_directory('./www', path)

@app.route('/api/mpg', methods=['POST'])
def calc_mpg():

    content = request.get_json(force=True)
    errors = []

    txt = content['text']
    pat=content['pattern']
    loc=search(pat, txt)
    response = {"id":str(uuid.uuid4()),"locations":loc,"modifiedtxt":''}
    return jsonify(response)

@app.route('/rep', methods=['POST'])
def replace():

    content = request.get_json(force=True)
    errors = []

    txt = content['text']
    pat=content['pattern']
    loc=search(pat, txt)
    rword=content['rword']
    i=0
    final=''
    while(i <(len(txt))):
        if i in loc:
            final = final + rword
            i = i + len(pat)
        else:
            final = final + txt[i]
            i=i+1
    response = {"id":str(uuid.uuid4()),"modifiedtxt":final}
    return jsonify(response)

if __name__ == '__main__':
    app.run(host= '0.0.0.0',debug=True)
    
