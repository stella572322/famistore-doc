import React, {type ReactNode, useEffect, useState} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import PasswordGate from '@site/src/components/PasswordGate';

// 包住整個網站：密碼正確前只顯示密碼視窗，任何頁面內容都不會渲染。
// 解鎖狀態只存在記憶體，站內換頁不需重輸；重新整理或關掉重開就要再輸入。
export default function Root({children}: {children: ReactNode}): ReactNode {
  const [unlocked, setUnlocked] = useState(false);
  const {siteConfig} = useDocusaurusContext();

  // 只有 `npm run check-links` 那次建置會開啟：讓伺服器端渲染出內容，Docusaurus 才能檢查壞連結。
  // 該次建置的輸出不會部署；瀏覽器端仍一律先顯示密碼視窗。
  const linkCheckBuild =
    siteConfig.customFields?.linkCheckBuild === true && !ExecutionEnvironment.canUseDOM;

  // 從帶 #錨點 的網址進來時，解鎖後才有內容，需手動捲到對應段落。
  useEffect(() => {
    if (!unlocked || !window.location.hash) {
      return;
    }
    const id = decodeURIComponent(window.location.hash.slice(1));
    document.getElementById(id)?.scrollIntoView();
  }, [unlocked]);

  if (unlocked || linkCheckBuild) {
    return <>{children}</>;
  }
  return <PasswordGate onUnlock={() => setUnlocked(true)} />;
}
