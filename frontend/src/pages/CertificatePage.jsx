import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "../contexts/AuthContext";
import { useProgress } from "../contexts/ProgressContext";
import { countTopics, findRoadmapById, getAllSlugs } from "../data/roadmaps";
import Icon from "../components/Icon";

const formatDate = (date) =>
  date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const buildCertId = (userId, trailId) => {
  const raw = `${userId}-${trailId}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash * 31 + raw.charCodeAt(i)) | 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0").slice(0, 8);
  return `QB-${hex.slice(0, 2)}-${hex.slice(2, 4)}-${hex.slice(4, 8)}`;
};

const CertificatePage = () => {
  const { trailId } = useParams();
  const { user } = useAuth();
  const { isCompleted } = useProgress();
  const certRef = useRef(null);
  const wrapRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [scale, setScale] = useState(1);

  const roadmap = findRoadmapById(trailId);
  const slugs = useMemo(() => (roadmap ? getAllSlugs(roadmap) : []), [roadmap]);
  const completedCount = slugs.filter((s) => isCompleted(s)).length;
  const horas = roadmap ? countTopics(roadmap) * 2 : 0;
  const dataConclusao = useMemo(() => formatDate(new Date()), []);
  const certId = useMemo(
    () => (user && roadmap ? buildCertId(user.id, roadmap.id) : ""),
    [user, roadmap]
  );

  useLayoutEffect(() => {
    const compute = () => {
      const el = wrapRef.current;
      if (!el) return;
      const available = el.clientWidth - 32;
      const next = Math.min(1, available / 1400);
      setScale(next > 0 ? next : 1);
    };
    compute();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", compute);
      return () => window.removeEventListener("resize", compute);
    }
    const ro = new ResizeObserver(compute);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [roadmap]);

  if (!user) return null;

  if (!roadmap) {
    return (
      <div className="card">
        <h1 className="title">Trilha não encontrada</h1>
        <Link to="/conteudos" className="button-secondary" style={{ display: "inline-block", marginTop: "1rem" }}>
          Voltar para trilhas
        </Link>
      </div>
    );
  }

  if (completedCount < slugs.length) {
    return (
      <div className="card">
        <h1 className="title">Certificado bloqueado</h1>
        <p className="subtitle">
          Você concluiu <strong>{completedCount} de {slugs.length}</strong> tópicos
          da trilha <strong>{roadmap.title}</strong>. Conclua todos pra liberar o certificado.
        </p>
        <Link to="/conteudos" className="button-secondary" style={{ display: "inline-block", marginTop: "1rem" }}>
          Voltar para trilhas
        </Link>
      </div>
    );
  }

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    const node = certRef.current;
    const prevTransform = node.style.transform;
    node.style.transform = "none";
    try {
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 1400,
        height: 990,
        windowWidth: 1400,
        windowHeight: 990,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = canvas.width / canvas.height;
      const pageRatio = pageWidth / pageHeight;
      let imgWidth = pageWidth;
      let imgHeight = pageWidth / imgRatio;
      if (imgRatio < pageRatio) {
        imgHeight = pageHeight;
        imgWidth = pageHeight * imgRatio;
      }
      const offsetX = (pageWidth - imgWidth) / 2;
      const offsetY = (pageHeight - imgHeight) / 2;
      pdf.addImage(imgData, "PNG", offsetX, offsetY, imgWidth, imgHeight);
      const safeName = user.username.replace(/[^A-Za-z0-9_-]/g, "_");
      pdf.save(`Certificado_${safeName}_${roadmap.id}.pdf`);
    } catch (e) {
      console.error("Falha ao gerar PDF:", e);
      alert("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      node.style.transform = prevTransform;
      setDownloading(false);
    }
  };

  return (
    <div className="certificate-page">
      <div className="certificate-page-header">
        <Link to="/conteudos" className="trail-back">
          <Icon name="chevronRight" size={14} style={{ transform: "rotate(180deg)" }} />
          Voltar para trilhas
        </Link>
        <button
          type="button"
          className="button-primary"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? "Gerando PDF..." : "Baixar como PDF"}
        </button>
      </div>

      <div
        className="certificate-canvas-wrap"
        ref={wrapRef}
        style={{ height: `${990 * scale + 32}px` }}
      >
        <div
          className="cert-paper"
          ref={certRef}
          style={{ transform: `scale(${scale})` }}
        >
          <div className="cert-content">
            <h2 className="cert-title">CERTIFICADO</h2>
            <h3 className="cert-subtitle">DE CONCLUSÃO</h3>

            <p className="cert-text">Certificamos que</p>
            <div className="cert-name">{user.username}</div>

            <p className="cert-text">concluiu com sucesso o curso</p>
            <div className="cert-course">{roadmap.title}</div>

            <p className="cert-paragraph">
              com carga horária de <strong>{horas}h</strong>, seguindo a timeline
              de estudos e concluindo todos os objetivos propostos.
            </p>

            <div className="cert-info-grid">
              <div className="cert-info-item">
                <span className="cert-info-label">CONCLUÍDO EM</span>
                <span className="cert-info-value">{dataConclusao}</span>
              </div>
              <div className="cert-info-item">
                <span className="cert-info-label">CARGA HORÁRIA</span>
                <span className="cert-info-value">{horas}h</span>
              </div>
              <div className="cert-info-item">
                <span className="cert-info-label">CERTIFICADO ID</span>
                <span className="cert-info-value cert-info-value-mono">{certId}</span>
              </div>
            </div>

            <div className="cert-signature">
              <div className="cert-signature-line" />
              <p>Equipe QuizByte</p>
            </div>
          </div>
        </div>
      </div>

      <p className="cert-footer-note">
        Certificado gerado em {dataConclusao}. ID: <code>{certId}</code>.
      </p>
    </div>
  );
};

export default CertificatePage;
