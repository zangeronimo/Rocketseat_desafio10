import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    api.get('/foods').then(result => setFoods(result.data));
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const data = { ...food, available: true };
      const result = await api.post('/foods', data);
      setFoods([...foods, result.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    const data = { ...editingFood, ...food };
    const result = await api.put(`/foods/${editingFood.id}`, data);
    const editedFood = result.data;

    const newArrayFoods = foods.map(item =>
      item.id === editedFood.id ? editedFood : item,
    );

    setFoods(newArrayFoods);
  }

  async function handleAvailableFood(food: IFoodPlate): Promise<void> {
    try {
      const data = { ...food, available: !food.available };
      const result = await api.patch(`/foods/${food.id}`, data);
      const editedFood = result.data;

      const newArrayFoods = foods.map(item =>
        item.id === editedFood.id ? editedFood : item,
      );

      setFoods(newArrayFoods);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number): Promise<void> {
    await api.delete(`/foods/${id}`);

    const newArrayFoods = foods.filter(item => item.id !== id);

    setFoods(newArrayFoods);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              handleAvailableFood={handleAvailableFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
