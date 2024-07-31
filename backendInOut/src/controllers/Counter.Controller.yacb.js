import { pool } from "../database/conexion.js";

//Reset notificaciones
//reset loans due
export const resetLoansStatus = async (req, res)=>{
  try {
    await pool.query(`UPDATE counters SET status = 0 
        WHERE counter_name = 'loans_due'`);
        return res.status(200).json({message: "Loans due status reset to 0" });
    } catch (error) {
      return res.status(500).json({message:error.message});
    }
  };

//reset stock low
export const resetStockStatus = async (req, res)=>{
  try {
    await pool.query(`UPDATE counters SET status = 0 
        WHERE counter_name = 'low_stock'`);
        return res.status(200).json({message: "Low stock status reset to 0" });
    } catch (error) {
      return res.status(500).json({message:error.message});
    }
  };

//reset requesteds
export const resetRequestedsStatus = async (req, res)=>{
  try {
    await pool.query(`UPDATE counters SET status = 0 
        WHERE counter_name = 'requesteds'`);
        return res.status(200).json({message: "Requesteds status reset to 0" });
    } catch (error) {
      return res.status(500).json({message:error.message});
    }
  };

//reset expired
export const resetExpiredStatus = async (req, res)=>{
  try {
    await pool.query(`UPDATE counters SET status = 0 
        WHERE counter_name = 'date_expired'`);
        return res.status(200).json({message: "Date expired status reset to 0" });
    } catch (error) {
      return res.status(500).json({message:error.message});
    }
  };

 // reset counter loans-due
 export const updateLoansCounter = async (req, res) => {
  try {
    await pool.query(`UPDATE counters SET count = ?
      WHERE counter_name = 'loans_due'`);
    res.status(200).json({ message: "Loans due staus updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  // reset counter date_expired
  export const updateExpiredCounter = async (req, res) => {
    try {
      await pool.query(`UPDATE counters SET count = ?
        WHERE counter_name = 'date_expired'`);
      res.status(200).json({ message: "Loans due staus updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

    // reset counter loans-due
export const updateStockCounter = async (req, res) => {
  try {
    await pool.query(`UPDATE counters SET count = ?
      WHERE counter_name = 'low_stock'`);
    res.status(200).json({ message: "Loans due staus updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  // reset counter requesteds
  export const updateRequestedCounter = async (req, res) => {
    try {
      await pool.query(`UPDATE counters SET count = ?
        WHERE counter_name = 'requesteds'`);
      res.status(200).json({ message: "Loans due staus updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Endpoint para obtener los contadores
export const getCounters = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM counters');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};