import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AvatarCircle } from "../../components/AvatarCircle";
import { Btn } from "../../components/Btn";
import { GradientScreen } from "../../components/GradientScreen";
import { Icon } from "../../components/Icon";
import { useApp } from "../../context/AppContext";
import { AVATARS, CardShadow, Colors } from "../../lib/colors";
import { Child } from "../../types";

type ModalMode = 'add' | 'edit';

function ChildCard({
  child,
  onEdit,
  onDelete,
}: {
  child: Child;
  onEdit: (c: Child) => void;
  onDelete: (c: Child) => void;
}) {
  const av = AVATARS.find((a) => a.id === child.avatar) ?? AVATARS[0];
  return (
    <View style={styles.childCard}>
      <AvatarCircle id={child.avatar} size={48} ring />
      <View style={{ flex: 1 }}>
        <Text style={styles.childName}>{child.name}</Text>
        <Text style={styles.childAvName}>{av.name}</Text>
      </View>
      <View style={styles.childStats}>
        <View style={styles.childStatPill}>
          <Text style={styles.childStatText}>⭐ {child.stars}</Text>
        </View>
        <View style={[styles.childStatPill, { backgroundColor: "#FFF4D1" }]}>
          <Text style={[styles.childStatText, { color: "#8A6D14" }]}>
            🔥 {child.streak}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onEdit(child)} style={styles.editBtn}>
        <Icon name="edit" size={16} color={Colors.ink2} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(child)} style={[styles.editBtn, { backgroundColor: '#FFF0F0', borderColor: '#FFCDD2' }]}>
        <Icon name="trash" size={16} color={Colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

export default function ParentProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { family, children, tasks, addChild, updateChild, deleteChild, regenerateFamilyCode, logout } = useApp();

  const [copied, setCopied] = useState(false);
  const [regenBusy, setRegenBusy] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState("fox");
  const [saveBusy, setSaveBusy] = useState(false);

  const copyCode = async () => {
    await Clipboard.setStringAsync(family.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openAdd = () => {
    setModalMode('add');
    setEditingChild(null);
    setNewName('');
    setNewAvatar('fox');
    setShowModal(true);
  };

  const openEdit = (child: Child) => {
    setModalMode('edit');
    setEditingChild(child);
    setNewName(child.name);
    setNewAvatar(child.avatar);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!newName.trim()) return;
    setSaveBusy(true);
    try {
      if (modalMode === 'add') {
        await addChild({ id: '', family_id: family.id, name: newName.trim(), avatar: newAvatar, stars: 0, streak: 0 });
      } else if (editingChild) {
        await updateChild(editingChild.id, newName.trim(), newAvatar);
      }
      setShowModal(false);
    } finally {
      setSaveBusy(false);
    }
  };

  const handleDelete = (child: Child) => {
    Alert.alert(
      `Удалить ${child.name}?`,
      'Будут удалены все задания этого ребёнка. Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => deleteChild(child.id) },
      ]
    );
  };

  const handleRegen = () => {
    Alert.alert(
      'Сменить семейный код?',
      'Старый код перестанет работать. Детям нужно будет войти заново с новым кодом.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Сменить', style: 'destructive', onPress: async () => {
            setRegenBusy(true);
            await regenerateFamilyCode();
            setRegenBusy(false);
          }
        },
      ]
    );
  };

  return (
    <GradientScreen>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Parent card */}
          <View style={styles.card}>
            <View style={styles.parentAvatarWrap}>
              <Text style={{ fontSize: 36 }}>👨‍👩‍👧</Text>
            </View>
            <Text style={styles.parentName}>{family.parent_name}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>Родитель</Text>
            </View>

            <View style={styles.codeBlock}>
              <Text style={styles.codeLabel}>Семейный код</Text>
              <Text style={styles.codeValue}>{family.code}</Text>
            </View>

            <View style={styles.codeActions}>
              <TouchableOpacity style={[styles.codeBtn, { flex: 1 }]} onPress={copyCode}>
                <Icon name="copy" size={16} color={copied ? Colors.success : Colors.ink2} />
                <Text style={[styles.codeBtnText, copied && { color: Colors.success }]}>
                  {copied ? 'Скопировано!' : 'Скопировать'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.codeBtn, { flex: 1 }]} onPress={handleRegen} disabled={regenBusy}>
                <Text style={{ fontSize: 15 }}>🔄</Text>
                <Text style={styles.codeBtnText}>{regenBusy ? 'Меняем...' : 'Сменить код'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Children section */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Дети</Text>
                <Text style={styles.sectionSub}>
                  {children.length}{' '}
                  {children.length === 1 ? 'ребёнок' : 'детей'} в семье
                </Text>
              </View>
              <Btn label="Добавить" small onPress={openAdd}>
                <Icon name="plus" size={16} color="#fff" />
              </Btn>
            </View>

            {children.map((c) => (
              <ChildCard key={c.id} child={c} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </View>

          <View style={{ height: 8 }} />

          <Btn
            label="Выйти"
            variant="white"
            onPress={async () => { await logout(); router.replace('/welcome'); }}
            style={{ width: '100%' }}
          >
            <Icon name="logout" size={20} color={Colors.danger} />
          </Btn>

          <View style={{ height: 16 }} />
        </ScrollView>
      </SafeAreaView>

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {modalMode === 'add' ? 'Новый ребёнок' : 'Изменить профиль'}
            </Text>

            <Text style={styles.modalLabel}>Имя</Text>
            <TextInput
              style={styles.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Имя ребёнка"
              placeholderTextColor={Colors.ink4}
              autoFocus
            />

            <Text style={styles.modalLabel}>Аватар</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map((av) => (
                <TouchableOpacity
                  key={av.id}
                  onPress={() => setNewAvatar(av.id)}
                  style={[styles.avatarBtn, newAvatar === av.id && { borderColor: av.color, backgroundColor: av.color + '18' }]}
                >
                  <AvatarCircle id={av.id} size={44} ring={newAvatar === av.id} />
                  <Text style={[styles.avatarName, newAvatar === av.id && { color: av.color }]}>{av.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Btn label="Отмена" variant="white" onPress={() => setShowModal(false)} style={{ flex: 1 }} />
              <Btn
                label={modalMode === 'add' ? 'Добавить' : 'Сохранить'}
                disabled={!newName.trim()}
                loading={saveBusy}
                onPress={handleSave}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },

  card: { backgroundColor: '#fff', borderRadius: 28, padding: 20, marginBottom: 14, ...CardShadow, alignItems: 'center' },
  parentAvatarWrap: {
    width: 80, height: 80, borderRadius: 999, backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  parentName: { fontSize: 24, fontWeight: '900', color: Colors.ink, marginBottom: 6 },
  roleBadge: { backgroundColor: Colors.primarySoft, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 999, marginBottom: 18 },
  roleText: { fontSize: 12, fontWeight: '800', color: Colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },

  codeBlock: {
    width: '100%', backgroundColor: Colors.bg, borderRadius: 18,
    padding: 16, alignItems: 'center', borderWidth: 2, borderColor: Colors.line, marginBottom: 10,
  },
  codeLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  codeValue: { fontSize: 32, fontWeight: '900', letterSpacing: 8, color: Colors.ink },

  codeActions: { flexDirection: 'row', gap: 8, width: '100%' },
  codeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 14, borderWidth: 2, borderColor: Colors.line, backgroundColor: '#fff',
  },
  codeBtnText: { fontSize: 13, fontWeight: '700', color: Colors.ink2 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, width: '100%' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.ink },
  sectionSub: { fontSize: 11, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 },

  childCard: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.line },
  childName: { fontSize: 15, fontWeight: '800', color: Colors.ink, marginBottom: 2 },
  childAvName: { fontSize: 11, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.4 },
  childStats: { flexDirection: 'column', gap: 4, alignItems: 'flex-end' },
  childStatPill: { backgroundColor: '#DFFBE9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  childStatText: { fontSize: 11, fontWeight: '800', color: '#1A8048' },
  editBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.line, alignItems: 'center', justifyContent: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 36 },
  modalHandle: { width: 40, height: 4, borderRadius: 999, backgroundColor: Colors.line, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: Colors.ink, marginBottom: 20 },
  modalLabel: { fontSize: 14, fontWeight: '700', color: Colors.ink2, marginBottom: 8 },
  modalInput: {
    width: '100%', padding: 16, backgroundColor: Colors.bg,
    borderWidth: 2, borderColor: Colors.line, borderRadius: 18,
    fontSize: 16, fontWeight: '600', color: Colors.ink, marginBottom: 18,
  },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  avatarBtn: { width: '30%', padding: 12, borderRadius: 18, borderWidth: 2, borderColor: Colors.line, backgroundColor: '#fff', alignItems: 'center', gap: 6 },
  avatarName: { fontSize: 11, fontWeight: '800', color: Colors.ink3 },
  modalActions: { flexDirection: 'row', gap: 10 },
});
