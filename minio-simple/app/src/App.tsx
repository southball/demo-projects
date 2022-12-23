import { FileUploader } from './components/FileUploader';
import { FileList } from './components/FileList';

function App() {
  return (
    <div className="container">
      <h1>Minio CRUD</h1>
      <FileUploader />
      <FileList />
    </div>
  );
}

export default App;
