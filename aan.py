x = 170141183460469231731687303715884105727
y = 0

# find factors of x
for i in range(2, int(x**0.5)+1):
  # print every 10000000 iterations
  if i % 10000000 == 0:
    print(i)

  if x % i == 0:
      y = i
      break

print(y)
