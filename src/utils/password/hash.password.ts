import bcrypt from 'bcryptjs';

export interface HashPassword {
  (password: string): Promise<string>;
}

const hashPassword: HashPassword = async password => {
  try {
    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (error) {
    throw error;
  }
};

export default hashPassword;
