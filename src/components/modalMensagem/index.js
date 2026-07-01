import React, { useState } from 'react';
import {View, Text,  TextInput,  TouchableOpacity,  StyleSheet, Modal } from 'react-native';
import { colors } from '../../assets/css/globalStyles';

export function ModalMensagem({ handleClose, type, message }) {

  return (

      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{type == 'success' ? 'Sucesso' : 'Erro'}</Text>

          <Text style={styles.message}>{message}</Text>

          {/* Botões */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.save} onPress={handleClose}>
              <Text style={styles.buttonText}>fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 15
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  cancel: {
    backgroundColor: colors.btncancelar,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 10
  },
  save: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
