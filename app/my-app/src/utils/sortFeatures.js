export const sortFeatures = (f1, f2) => {
  var t1 = f1.id; // f1.timeCost || 1000000
  var t2 = f2.id //f2.timeCost || 1000000

  if (f1.solved)
    t1 += 1000000

  if (f2.solved)
    t2 += 1000000

  return t1 - t2
}
