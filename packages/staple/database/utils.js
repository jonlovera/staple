module.exports.parseWhere = idOrWhere =>
  typeof idOrWhere === "object" ? idOrWhere : { id: idOrWhere };
