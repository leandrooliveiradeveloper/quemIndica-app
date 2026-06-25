// globalStyles.js
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#392de9',
  secondary: '#25D366',
  danger: '#E74C3C',
  background: '#FFF',
  text: '#333',
  textinput: '#0d0ddfc8',
  background: '#0a4c96f7',
  btnwhatsapp: '#25d366',
  placeholdertext: '#6c6b6b',
  btncancelar: '#E74C3C',
  formerro: '#E74C3C',
};

export const fonts = {
  regular: 'System',
  bold: 'System',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    padding: 10,
    marginBottom: 17,
    backgroundColor: '#F9F9F9',
  },
  logo: {
    width: 300,
    height: 120,
    marginTop: 50
  },
});
