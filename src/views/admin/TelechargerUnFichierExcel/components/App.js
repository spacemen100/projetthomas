import { useState } from "react";
import * as XLSX from 'xlsx';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

function App() {
  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  // submit state
  const [excelData, setExcelData] = useState(null);

  // onchange event
  const handleFile=(e)=>{
    let fileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];
    let selectedFile = e.target.files[0];
    if(selectedFile){
      if(selectedFile&&fileTypes.includes(selectedFile.type)){
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e)=>{
          setExcelFile(e.target.result);
        }
      }
      else{
        setTypeError('Please select only excel file types');
        setExcelFile(null);
      }
    }
    else{
      console.log('Please select your file');
    }
  }

  // submit event
  const handleFileSubmit=(e)=>{
    e.preventDefault();
    if(excelFile!==null){
      const workbook = XLSX.read(excelFile,{type: 'buffer'});
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0,10));
    }
  }

  return (
    <Box className="wrapper" p={4}>
      <form className="form-group custom-form" onSubmit={handleFileSubmit}>
        <FormControl>
          <FormLabel>Choisissez un fichier Excel</FormLabel>
          <Input type="file" required onChange={handleFile} />
        </FormControl>
        <Button type="submit" colorScheme="teal" mt={2}>
          Télécharger
        </Button>
        {typeError && (
          <Alert status="error" mt={2}>
            <AlertIcon />
            {typeError}
          </Alert>
        )}
      </form>

      {/* view data */}
      <Box className="viewer" mt={4}>
        {excelData ? (
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                {Object.keys(excelData[0]).map((key) => (
                  <Th key={key}>{key}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {excelData.map((individualExcelData, index) => (
                <Tr key={index}>
                  {Object.keys(individualExcelData).map((key) => (
                    <Td key={key}>{individualExcelData[key]}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text>Aucun fichier téléchargé pour l'instant !</Text>
        )}
      </Box>
    </Box>
  );
}

export default App;
