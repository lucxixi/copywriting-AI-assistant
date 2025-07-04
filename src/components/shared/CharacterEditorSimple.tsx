import React from 'react';

export interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  isPreset: boolean;
}

interface CharacterEditorProps {
  characters: Character[];
  onCharactersChange: (characters: Character[]) => void;
  maxCharacters?: number;
}

const CharacterEditorSimple: React.FC<CharacterEditorProps> = ({
  characters,
  onCharactersChange,
  maxCharacters = 5
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-lg">👥</span>
        <h3 className="text-lg font-semibold text-gray-900">角色管理</h3>
      </div>
      
      <div className="text-sm text-gray-600">
        当前角色数量: {characters.length} / {maxCharacters}
      </div>

      <div className="space-y-2">
        {characters.map((character) => (
          <div key={character.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{character.name}</div>
            <div className="text-sm text-gray-600">{character.role}</div>
            <div className="text-xs text-gray-500">{character.personality}</div>
          </div>
        ))}
      </div>

      {characters.length === 0 && (
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">👥</span>
          <p className="text-gray-500">暂无角色，请添加角色</p>
        </div>
      )}
    </div>
  );
};

export default CharacterEditorSimple;
