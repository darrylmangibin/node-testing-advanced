import bcrypt from 'bcryptjs';

export interface ComparePassword {
  (plainPassword?: string, hashedPassword?: string): Promise<boolean>;
}

const comparePassword: ComparePassword = async (plainPassword, hashedPassword) => {
  try {
    if (!plainPassword || !hashedPassword) {
      return false;
    }

    return bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw error;
  }
};

export default comparePassword;
