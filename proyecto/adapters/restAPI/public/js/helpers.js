

export function buildTable(eArray) {
    if(eArray == null || eArray.length === 0)
        return ""
    let htmlTitle = buildTableTitle(Object.keys(eArray[0]))
    let htmlEntries = eArray.map(e => buildTableEntry(Object.values(e)))
    return `<table>${htmlTitle}\n${htmlEntries.join("\n")}</table>`
}

function buildTableTitle(keysArray) {
    let columns = keysArray.map(key => `<th>${key}</th>`)
    return `<tr>${columns.join("\n")}</tr>`
}

function buildTableEntry(valuesArray) {
    let columns = valuesArray.map(value => `<td>${value}</td>`)
    return `<tr>${columns.join("\n")}</tr>`
}