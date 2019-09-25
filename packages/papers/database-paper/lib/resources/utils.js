module.exports.parseWhere = idOrWhere => {
  if (typeof idOrWhere === "object") return idOrWhere;
  return { id: idOrWhere };
};
