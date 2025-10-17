// Đếm số lần xuất hiện của từng phần tử

const numbers = [4, 5, 4, 2, 1, 3, 8, 4, 9, 2];
console.log(getNumber(numbers))

function getNumber(numbers) {
    const map = new Map()
    for (let num of numbers) {
        if (!map.has(num)) {
            map.set(num, 1)
        } else {
            map.set(num, map.get(num) + 1)
        }
    }
    return map;
}