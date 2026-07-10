function fechaEnDias(dias, referencia = new Date()) {
  const fecha = new Date(Date.UTC(
    referencia.getUTCFullYear(),
    referencia.getUTCMonth(),
    referencia.getUTCDate() + dias,
  ));
  return fecha.toISOString().slice(0, 10);
}

module.exports = { fechaEnDias };
