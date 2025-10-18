import React, { useEffect, useState } from 'react';
import { 
  View, TextInput, TouchableOpacity, FlatList, Text,
  KeyboardAvoidingView, Platform, StyleSheet,
  SafeAreaView, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import socket from '../socket';
import { LinearGradient } from 'expo-linear-gradient';
import DashboardHeader from '../dashboardheader';

const COLORS = {
  BACKGROUND_LIGHT: '#F7F8FC',
  BACKGROUND_DARK: '#2D4B46',
  ACCENT_GOLD: '#FFB733',
  TEXT_DARK: '#333333',
  TEXT_LIGHT: '#FFFFFF',
  INPUT_BG: 'rgba(45, 75, 70, 0.05)',
  CARD_BG: '#FFFFFF',
  SECONDARY_TEXT: '#888',
  SHADOW: 'rgba(0,0,0,0.1)',
};

const ChatThreadLink = ({ user, onPress, selected }) => {
  return (
    <TouchableOpacity
      style={[styles.userCard, selected && styles.selectedUserCard]}
      onPress={onPress}
    >
      <Text style={styles.userName}>{user.userName || 'User'}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>{user.lastMessage || 'New conversation'}</Text>
      {user.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{user.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};


const AgentChat = ({ route }) => {
  const agentId = route?.params?.userId || null; // <-- changed


  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.connect();
    socket.emit('getUsersWithMessages', agentId);

    socket.on('usersList', (list) => setUsersList(list));

    socket.on('receiveMessage', (msg) => {
      if (selectedUser && msg.userId === selectedUser.userId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('usersList');
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, [agentId, selectedUser]);

  const selectUser = (user) => {
    setSelectedUser(user);
    setMessages([]);
    socket.emit('joinRoom', user.userId);
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedUser) return;
    const data = {
      userId: selectedUser.userId,
      agentId,
      sentBy: 'agent',
      message: input.trim(),
    };
    socket.emit('sendMessage', data);
    setInput('');
  };

  const renderMessageItem = ({ item }) => {
    const isAgent = item.sentBy === 'agent';
    const time = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    return (
      <View style={[styles.messageRow, isAgent ? styles.agentRow : styles.userRow]}>
        <View style={[styles.messageBubble, isAgent ? styles.agentBubble : styles.userBubble]}>
          <Text style={isAgent ? styles.agentMessageText : styles.userMessageText}>{item.message}</Text>
          <Text style={styles.timestamp}>{time}</Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={[COLORS.BACKGROUND_LIGHT, COLORS.BACKGROUND_LIGHT]} style={styles.container}>
      <SafeAreaView style={styles.mainWrapper}>
        
        {/* Sidebar for web */}
        {Platform.OS === 'web' && (
          <View style={styles.sidebar}>
            <Text style={styles.sidebarHeader}>Live Threads</Text>
            <ScrollView>
              {usersList.map((user) => (
                <ChatThreadLink
                  key={user.userId}
                  user={user}
                  selected={selectedUser?.userId === user.userId}
                  onPress={() => selectUser(user)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Main Chat Area */}
        <View style={styles.chatArea}>
          {/* Dashboard Header */}
          <DashboardHeader user={{ _id: agentId }} />

          {/* Users horizontal scroll for mobile */}
          {Platform.OS !== 'web' && (
            <ScrollView horizontal style={styles.usersContainer}>
              {usersList.map((user) => (
                <ChatThreadLink
                  key={user.userId}
                  user={user}
                  selected={selectedUser?.userId === user.userId}
                  onPress={() => selectUser(user)}
                />
              ))}
            </ScrollView>
          )}

          {/* Chat Messages */}
          {selectedUser ? (
            <KeyboardAvoidingView style={styles.flexOne} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <FlatList
                data={messages}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={renderMessageItem}
                contentContainerStyle={styles.flatListContent}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Type a message..."
                  placeholderTextColor={COLORS.SECONDARY_TEXT}
                  style={styles.input}
                  multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={!input.trim()}>
                  <Ionicons name="send" size={20} color={COLORS.BACKGROUND_DARK} />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          ) : (
            <View style={styles.selectUserPrompt}>
              <Text>Select a user to start chatting</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AgentChat;

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  container: { flex: 1 },
  mainWrapper: { flex: 1, flexDirection: Platform.OS === 'web' ? 'row' : 'column' },
  sidebar: { width: 250, backgroundColor: COLORS.BACKGROUND_DARK, padding: 10 },
  sidebarHeader: { color: COLORS.ACCENT_GOLD, fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  chatArea: { flex: 1 },
  usersContainer: { maxHeight: 120, paddingVertical: 10, paddingHorizontal: 5 },
  userCard: {
    backgroundColor: COLORS.CARD_BG,
    padding: 12,
    marginHorizontal: 6,
    borderRadius: 15,
    minWidth: 140,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  selectedUserCard: { borderWidth: 2, borderColor: COLORS.ACCENT_GOLD },
  userName: { fontWeight: 'bold', fontSize: 14, color: COLORS.BACKGROUND_DARK },
  lastMessage: { fontSize: 12, color: COLORS.SECONDARY_TEXT, marginTop: 3 },
  unreadBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 5,
    minWidth: 16,
    alignItems: 'center',
  },
  unreadText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  flatListContent: { padding: 10 },
  messageRow: { marginVertical: 5, maxWidth: '80%' },
  userRow: { alignSelf: 'flex-start' },
  agentRow: { alignSelf: 'flex-end' },
  messageBubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 15 },
  userBubble: { backgroundColor: COLORS.CARD_BG, borderWidth: 1, borderColor: COLORS.INPUT_BG },
  agentBubble: { backgroundColor: COLORS.ACCENT_GOLD },
  userMessageText: { fontSize: 15, color: COLORS.TEXT_DARK },
  agentMessageText: { fontSize: 15, color: COLORS.BACKGROUND_DARK },
  timestamp: { fontSize: 10, color: COLORS.BACKGROUND_DARK, opacity: 0.7, marginTop: 3, alignSelf: 'flex-end' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: COLORS.CARD_BG, borderTopWidth: 1, borderTopColor: COLORS.INPUT_BG },
  input: { flex: 1, backgroundColor: COLORS.INPUT_BG, borderRadius: 25, paddingHorizontal: 15, paddingVertical: Platform.OS === 'ios' ? 12 : 8, marginRight: 10, maxHeight: 100, fontSize: 16, color: COLORS.TEXT_DARK },
  sendButton: { backgroundColor: COLORS.ACCENT_GOLD, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  selectUserPrompt: { flex: 1, justifyContent: 'center', alignItems: 'center', color: COLORS.SECONDARY_TEXT },
});
