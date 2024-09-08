import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Calculator = () => {
  const [input, setInput] = useState<string>(''); 
  const [result, setResult] = useState<string>(''); 
  const [isOperatorLocked, setIsOperatorLocked] = useState<boolean>(false); 
  const [darkMode, setDarkMode] = useState<boolean>(true); 
  const [historyVisible, setHistoryVisible] = useState<boolean>(false); 
  const [history, setHistory] = useState<string[]>([]); 
  const [menuVisible, setMenuVisible] = useState<boolean>(false); 
  const fadeAnim = useRef(new Animated.Value(1)).current; 
  const translateAnim = useRef(new Animated.Value(0)).current; 

  const handlePress = (value: string) => {
    if (input === 'lỗi biểu thức' && value !== 'AC') return;

    if (input === '') {
      if (value === '00' || value === '0') {
        setInput('0');
        return;
      }

      if (value === '%') {
        setInput('%');
        return;
      }

      if (value === '-') {
        setInput('-');
        setIsOperatorLocked(true); 
        return;
      }

      if (['+', 'x', '÷'].includes(value)) {
        return; 
      }
    }

    if (input === '0') {
      if (value === ',') {
        setInput('0,'); 
        return;
      }

      if (value === '0' || value === '00') {
        return; 
      }

      setInput(value);
      return;
    }

    if (['+', 'x', '÷', '-'].includes(value)) {
      if (isOperatorLocked) return; 

      if (['+', 'x', '÷', '-'].includes(input.slice(-1))) {
        setInput(input.slice(0, -1) + value); 
      } else {
        setInput(input + value);
      }
      return;
    }

    if (value === '=') {
      if (input === '' || ['+', 'x', '÷', '-'].includes(input.slice(-1))) return;

      try {
        const replacedInput = input.replace(/x/g, '*').replace(/÷/g, '/').replace(/,/g, '.');
        const calculatedResult = (eval(replacedInput)).toFixed(10).replace(/\.?0+$/, '').replace(/\./g, ',');

        setHistory((prev) => [input + ' = ' + calculatedResult, ...prev]); 
        setResult(calculatedResult);
        animateCalculation();
      } catch (error) {
        setInput('lỗi biểu thức');
      }
      return;
    }

    if (value === 'AC') {
      setInput('');
      setResult('');
      setIsOperatorLocked(false); 
      return;
    }

    if (value === '←') {
      setInput(input.slice(0, -1));
      return;
    }

    if (value === '%') {
      setInput((prev) => prev + '%');
      return;
    }

    setInput((prev) => prev + value);
  };

  const animateCalculation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: -30,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    fadeAnim.setValue(1);
    translateAnim.setValue(0);
  }, [input]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleHistoryVisibility = () => {
    setHistoryVisible(!historyVisible);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#000' : '#fff' }]}>
      {historyVisible ? (
        <View style={styles.historyView}>
          <View style={styles.historyHeader}>
            <TouchableOpacity style={styles.backButton} onPress={toggleHistoryVisibility}>
              <Ionicons name="arrow-back-outline" size={24} color="green" />
              <Text style={styles.backText}>Quay lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
              <Text style={styles.clearText}>Xóa</Text>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.historyScroll}>
            {history.map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={[styles.historyText, { color: darkMode ? '#fff' : '#000' }]}>{entry}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (

        <View style={{ flex: 1 }}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <Ionicons name="ellipsis-horizontal" size={30} color={darkMode ? '#fff' : '#000'} />
            </TouchableOpacity>

            {menuVisible && (
              <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem} onPress={toggleDarkMode}>
                  <Ionicons name={darkMode ? 'sunny-outline' : 'moon-outline'} size={24} color={darkMode ? '#fff' : '#000'} />
                  <Text style={[styles.menuItemText, { color: darkMode ? '#fff' : '#000' }]}>
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={toggleHistoryVisibility}>
                  <Ionicons name="time-outline" size={24} color={darkMode ? '#fff' : '#000'} />
                  <Text style={[styles.menuItemText, { color: darkMode ? '#fff' : '#000' }]}>Lịch sử</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.resultContainer}>
            <Animated.Text
              style={[
                styles.inputText,
                {
                  color: darkMode ? '#fff' : '#000',
                  opacity: fadeAnim,
                  transform: [{ translateY: translateAnim }],
                },
              ]}
            >
              {input}
            </Animated.Text>
            <Text style={[styles.resultText, { color: darkMode ? '#fff' : '#000' }]}>{result}</Text>
          </View>

          <View style={styles.buttonContainer}>
            {[
              ['AC', '%', '←', '÷'],
              ['7', '8', '9', 'x'],
              ['4', '5', '6', '-'],
              ['1', '2', '3', '+'],
              ['00', '0', ',', '='],
            ].map((row, rowIndex) => (
              <View key={rowIndex} style={styles.buttonRow}>
                {row.map((buttonValue) => (
                  <TouchableOpacity
                    key={buttonValue}
                    style={styles.button}
                    onPress={() => handlePress(buttonValue)}
                  >
                    {buttonValue === '←' ? (
                      <Ionicons name="backspace-outline" size={24} color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>{buttonValue}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuButton: {
    alignSelf: 'flex-start',
  },
  menu: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  resultContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  inputText: {
    fontSize: 36,
  },
  resultText: {
    fontSize: 48,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end', 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
  historyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: 'green',
    marginLeft: 5,
    fontSize: 18,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearText: {
    color: 'red',
    marginRight: 5,
    fontSize: 18,
  },
  historyScroll: {
    width: '100%',
    paddingHorizontal: 10,
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyText: {
    fontSize: 20,
  },
});
export default Calculator;