import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Search, Plus, Save, Minus, GripVertical, Settings2, Dumbbell } from 'lucide-react';
import { Exercise, Workout, ExerciseCategory } from '../../types';

export const BuildWorkoutModal: React.FC = () => {
  const { exercises, showBuildWorkoutModal, setShowBuildWorkoutModal, addWorkoutAdmin } = useApp();
  
  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'All'>('All');
  
  const [selectedExercises, setSelectedExercises] = useState<{
    exerciseId: string;
    sets: number;
    reps: string;
    restSec: number;
  }[]>([]);

  if (!showBuildWorkoutModal) return null;

  const handleClose = () => setShowBuildWorkoutModal(false);

  const filteredLibrary = exercises.filter(ex => {
    if (selectedCategory !== 'All' && ex.category !== selectedCategory) return false;
    if (searchQuery && !ex.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const addExercise = (ex: Exercise) => {
    setSelectedExercises([...selectedExercises, {
      exerciseId: ex.id,
      sets: ex.defaultSets,
      reps: ex.defaultReps,
      restSec: ex.defaultRestSec
    }]);
  };

  const removeExercise = (index: number) => {
    const newEx = [...selectedExercises];
    newEx.splice(index, 1);
    setSelectedExercises(newEx);
  };

  const updateExercise = (index: number, field: string, value: string | number) => {
    const newEx = [...selectedExercises];
    newEx[index] = { ...newEx[index], [field]: value };
    setSelectedExercises(newEx);
  };

  const saveRoutine = () => {
    if (!title.trim() || selectedExercises.length === 0) return;

    const newWorkout: Workout = {
      id: `custom-workout-${Date.now()}`,
      title: title.trim(),
      category: 'Strength',
      subcategory: 'Custom',
      difficulty: 'Intermediate',
      durationMinutes: selectedExercises.length * 5, // Rough estimate
      estimatedCalories: selectedExercises.length * 40,
      xpReward: selectedExercises.length * 20,
      description: 'A custom routine built by you.',
      equipmentRequired: 'Varies',
      exercises: selectedExercises
    };

    addWorkoutAdmin(newWorkout);
    handleClose();
    // Reset state
    setTitle('');
    setSelectedExercises([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#09130d] border border-[var(--accent-main)]/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-[#1b3424] flex items-center justify-between bg-[#0c1811]">
          <div className="flex items-center space-x-3">
            <Settings2 className="w-5 h-5 text-[var(--accent-main)]" />
            <h2 className="font-['Cinzel'] text-xl font-bold text-[#f5ebd7]">
              Build Your Routine
            </h2>
          </div>
          <button onClick={handleClose} className="p-2 text-[#8ea496] hover:text-[var(--accent-main)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Column: Builder */}
          <div className="w-full md:w-1/2 flex flex-col border-r border-[#1b3424]">
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="text-xs text-[#8ea496] font-bold mb-1 block uppercase tracking-wider">Routine Name</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Morning Iron Challenge" 
                  className="w-full bg-[#112417] border border-[#23462f] rounded-xl px-4 py-3 text-sm text-[#f5ebd7] placeholder-[#5c7566] focus:outline-none focus:border-[var(--accent-main)] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#8ea496] font-bold mb-2 block uppercase tracking-wider">Selected Movements ({selectedExercises.length})</label>
                {selectedExercises.length === 0 ? (
                  <div className="text-center p-8 border border-dashed border-[#1b3424] rounded-2xl bg-[#0c1811]">
                    <Dumbbell className="w-8 h-8 text-[#5c7566] mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-[#5c7566]">Add movements from the library to start building.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedExercises.map((ex, index) => {
                      const exerciseDef = exercises.find(e => e.id === ex.exerciseId);
                      return (
                        <div key={`${ex.exerciseId}-${index}`} className="p-3 bg-[#112417] rounded-xl border border-[#23462f]">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-sm font-bold text-[#f5ebd7]">{exerciseDef?.name}</h4>
                              <p className="text-[10px] text-[#8ea496]">{exerciseDef?.targetMuscles.join(', ')}</p>
                            </div>
                            <button onClick={() => removeExercise(index)} className="text-[#ef4444] hover:text-[#f87171] p-1">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[10px] text-[#5c7566]">Sets</label>
                              <input 
                                type="number" 
                                value={ex.sets} 
                                onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                                className="w-full bg-[#0a140e] border border-[#1b3424] rounded-lg px-2 py-1.5 text-xs text-[#f5ebd7]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-[#5c7566]">Reps/Time</label>
                              <input 
                                type="text" 
                                value={ex.reps} 
                                onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                                className="w-full bg-[#0a140e] border border-[#1b3424] rounded-lg px-2 py-1.5 text-xs text-[#f5ebd7]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-[#5c7566]">Rest (sec)</label>
                              <input 
                                type="number" 
                                value={ex.restSec} 
                                onChange={(e) => updateExercise(index, 'restSec', parseInt(e.target.value) || 0)}
                                className="w-full bg-[#0a140e] border border-[#1b3424] rounded-lg px-2 py-1.5 text-xs text-[#f5ebd7]"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-[#1b3424] bg-[#0c1811]">
              <button 
                onClick={saveRoutine}
                disabled={!title.trim() || selectedExercises.length === 0}
                className="w-full py-3.5 rounded-xl bg-[var(--accent-main)] hover:bg-[var(--accent-hover)] disabled:bg-[#1b3424] disabled:text-[#5c7566] disabled:cursor-not-allowed text-[#0a150e] font-black tracking-widest uppercase transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Routine</span>
              </button>
            </div>
          </div>

          {/* Right Column: Library */}
          <div className="w-full md:w-1/2 flex flex-col bg-[#0c1811]">
            <div className="p-4 border-b border-[#1b3424] space-y-3">
              <h3 className="text-xs font-bold text-[#8ea496] uppercase tracking-wider">Movement Library</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#5c7566]" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search exercises..."
                  className="w-full bg-[#112417] border border-[#23462f] rounded-xl pl-9 pr-4 py-2 text-sm text-[#f5ebd7] focus:outline-none focus:border-[var(--accent-main)] transition-colors"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {['All', 'Strength', 'Bodyweight', 'Cardio', 'Mobility'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors ${
                      selectedCategory === cat ? 'bg-[var(--accent-main)] text-[#0a150e]' : 'bg-[#14291c] text-[#8ea496] hover:bg-[#1b3826]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredLibrary.map(ex => (
                <div key={ex.id} className="flex items-center justify-between p-3 bg-[#112417] rounded-xl border border-[#1b3424] hover:border-[#2b553a] transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-[#f5ebd7]">{ex.name}</h4>
                    <span className="text-[10px] text-[#5c7566]">{ex.equipmentNeeded}</span>
                  </div>
                  <button 
                    onClick={() => addExercise(ex)}
                    className="w-8 h-8 rounded-lg bg-[var(--accent-main)]/10 text-[var(--accent-main)] hover:bg-[var(--accent-main)] hover:text-[#0a150e] flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
