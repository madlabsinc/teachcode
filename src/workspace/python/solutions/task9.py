a = 90
b = 85
c = 70
d = 75
e = 80
avg = ((a+b+c+d+e)/5)
print(avg)
if avg>90 and avg<100:
    print('A+')
elif avg>80 and avg<=90:
    print('A')
elif avg>70 and avg<=80:
    print('B')
elif avg>60 and avg<=70:
    print('C')
elif avg>50 and avg<=60:
    print('D')
else:
    print('F')
