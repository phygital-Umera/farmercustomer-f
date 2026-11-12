import { RouterProvider, createRouter } from '@tanstack/react-router';

// Import the generated route tree
import { Toaster } from 'react-hot-toast';
import AuthContextProvider from './context/AuthContextProvider';
import { useAuthContext } from './context/AuthContext';
import NotFound404 from './layouts/NotFound404';
import QueryProvider from './lib/react-query/QueryProvider';
import { routeTree } from './routeTree.gen';
import { WebSocketProvider } from './context/WebSocketContext';
import { AuthContextType } from './types';
import {useEffect, useState} from 'react';
import SplashScreen from './components/SplashScreen';
import { LanguageSelectModal } from './components/LanguageSelectModal';
import { useLanguageSync } from './i18n/useLanguageSync';

// Create a single router instance outside the component.
// The context here is just a placeholder — the real auth values are injected
// via router.update() inside RouterWithAuth whenever auth state changes.
const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound404,
  context: {
    // Placeholder: will be overridden by router.update() before any navigation
    auth: undefined! as AuthContextType,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

/**
 * Inner component — has access to AuthContext and keeps the router context
 * in sync with the latest auth state using router.update() + router.invalidate().
 *
 * This is the official TanStack Router pattern for passing React context into
 * beforeLoad guards: https://tanstack.com/router/latest/docs/framework/react/guide/router-context
 */
const RouterWithAuth = () => {
  const auth = useAuthContext();

  // Push updated auth context into the router whenever auth state changes.
  // router.invalidate() causes beforeLoad guards to re-run with the fresh context.
  useEffect(() => {
    router.update({ context: { auth } });
    router.invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated, auth.user?.role, auth.isLoading]);

  return <RouterProvider router={router} context={{ auth }} />;
};

/** Asks a logged-in user for a language once, and restores it afterwards. */
const LanguageGate = ({ hidden }: { hidden: boolean }) => {
  const { needsChoice, choose } = useLanguageSync();
  if (hidden || !needsChoice) return null;
  return <LanguageSelectModal onSelect={choose} />;
};

const App = () => {
  // Splash plays once per page load; App never remounts on route navigation.
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthContextProvider>
      <WebSocketProvider>
        <div>
          <Toaster />
        </div>
        <QueryProvider>
          <RouterWithAuth />
        </QueryProvider>
        <LanguageGate hidden={showSplash} />
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </WebSocketProvider>
    </AuthContextProvider>
  );
};

export default App;
