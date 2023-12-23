// pages/dashboard/[id].tsx

import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

const DashboardPage: React.FC = () => {
  // Votre contenu de page ici
  return <div>Page vide</div>;
};

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const id = params?.id; // Utilisez l'opérateur optionnel (?) pour éviter l'erreur

  // Si un ID est présent, effectuez la redirection
  if (id) {
    res.writeHead(302, {
      Location: '/dashboard', // Rediriger vers cette URL
    });
    res.end();
  }

  // Retournez un objet vide pour éviter tout problème
  return { props: {} };
};

export default DashboardPage;
