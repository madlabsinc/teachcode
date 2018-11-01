dict_random = {1:'one', 2: 'two', 3: 'three'}
for i in dict_random:
    print(i)
for i in dict_random:
    print(dict_random[i])
for i,j in dict_random.items():
    print(i,j)
print(len(dict_random))
dict_random[4] = 'four'
for i,j in dict_random.items():
    print(i,j)
