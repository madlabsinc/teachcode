random_list = ['one', 'two', 'three']
def display(random_list):
    for i in random_list:
        print(i)

if 'one' in random_list:
    print('Found!')
else:
    print('Not Found!')
print(len(random_list))
random_list.append('four')
display(random_list)
random_list.insert(1, 'five')
display(random_list)
random_list.remove('one')
display(random_list)
random_list.pop(0)
display(random_list)
del random_list[1]
display(random_list)
random_list.clear()
print('Empty!')
