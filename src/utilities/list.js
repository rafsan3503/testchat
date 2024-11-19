


const calcLeadIndex = (index) => {
    const realIndex = index + 1
    return realIndex
}

export const listContent = (theindex, listname, memberCount) => (`

    ${calcLeadIndex(theindex)} ${listname} - ${memberCount} member${memberCount>1 ? 's' : ''} - Vault: N/A SOL

`)