export const addLoginRecord = async (Id, ipAddress, db) => {
  try {
    // Crear el nuevo registro de login con la fecha actual e IP
    const newLoginRecord = {
      date: new Date(),       // Fecha y hora actual
      ipAddress: ipAddress    // IP del usuario
    };

    // Actualizar el historial de login del usuario
    await db.findByIdAndUpdate(
      Id,
      {
        $push: {
          loginRecord: {
            $each: [newLoginRecord], // Agregar el nuevo registro de login
            $slice: -10              // Mantener solo los últimos 10 logins
          }
        }
      },
      { new: true }  // Retorna el documento actualizado
    );
  } catch (error) {
    console.error("Error al actualizar el historial de login:", error);
  }
};
