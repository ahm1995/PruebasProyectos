exports.addLoginRecord = async (Id, db) => {
    try {
      // Crear el nuevo cambio con la fecha actual
      const newChange = {
        changeDate: new Date(),  // Fecha y hora actual
      };
  
      // Actualizar el historial del usuario
      await db.findByIdAndUpdate(
        Id,
        {
          $push: {
            loginRecord: {
              $each: [newChange],  // Agregar el nuevo cambio
              $slice: -10          // Mantener solo los últimos 10 cambios
            }
          }
        },
        { new: true }  // Retorna el documento actualizado
      );
    } catch (error) {
      console.error("Error al actualizar el historial de cambios:", error);
    }
  }
  