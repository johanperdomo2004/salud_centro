import React, { useState, useMemo, useEffect } from 'react';
import {
    Autocomplete,
    AutocompleteItem,
    Input,
    Button,
    Textarea
} from '@nextui-org/react';
import { ListarUsuarios, ListarElementos } from '../../../functions/Listar';
import { capitalize } from '../../../utils/columnsData';
import axiosClient from '../../config/axiosClient';
import AutocompleteMine from '../../AutoCompleteMine';

export const RegisterLoanUser = () => {
  return (
    <div>RegisterLoanUser</div>
  )
}
