function example0() {
  let toReturn = 0
  setTimeout(() => {toReturn = 100}, 5000)
  return toReturn
}
//console.log(example0())

function example1(){
    let toReturn = 0
    setTimeout(() => {toReturn = 500}, 0)
    setTimeout(() => {toReturn = 100}, 5000)
    return toReturn
}
// console.log(example1())

function example2(){
    setTimeout(() => {console.log('A')}, 0)
    setTimeout(() => {console.log('B')}, 5000)
    console.log('C')
    while(0 == 0) {}
    console.log('D')
}
// example2()