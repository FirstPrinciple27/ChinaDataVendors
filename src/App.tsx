import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleDashed,
  Filter,
  MapPin,
  Search,
  Send,
} from 'lucide-react'
import './App.css'
import { companies, updatedAt, type Company } from './data/companies'

const statusLabels: Record<Company['active'], string> = {
  active: '活跃',
  watch: '观察',
  inactive: '暂停',
}

const allValue = '全部'

function uniqueValues(values: string[]) {
  return [allValue, ...Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, 'zh-CN'))]
}

function App() {
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState(allValue)
  const [active, setActive] = useState<typeof allValue | Company['active']>(allValue)
  const [city, setCity] = useState(allValue)
  const [tag, setTag] = useState(allValue)

  const domains = useMemo(() => uniqueValues(companies.map((company) => company.domain)), [])
  const cities = useMemo(() => uniqueValues(companies.map((company) => company.city)), [])
  const tags = useMemo(
    () => uniqueValues(companies.flatMap((company) => company.tags)),
    [],
  )

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return companies.filter((company) => {
      const searchableText = [
        company.name,
        company.background,
        company.note,
        company.founders.join(' '),
      ]
        .join(' ')
        .toLowerCase()

      return (
        (domain === allValue || company.domain === domain) &&
        (active === allValue || company.active === active) &&
        (city === allValue || company.city === city) &&
        (tag === allValue || company.tags.includes(tag)) &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      )
    })
  }, [active, city, domain, query, tag])

  const activeCount = companies.filter((company) => company.active === 'active').length
  const cityCount = new Set(companies.map((company) => company.city)).size
  const domainCount = new Set(companies.map((company) => company.domain)).size

  return (
    <main className="app-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">China AI Company Directory</p>
          <h1>中国 AI / RL 环境 / Agent 数据服务公司目录</h1>
          <p className="intro">
            一个面向研究员、创业者和投资观察者的静态目录，聚焦中国 AI 基础设施、强化学习环境、
            具身智能与 Agent 数据服务相关公司。条目基于公开资料整理，建议用于线索发现和交叉验证。
          </p>
          <div className="hero-actions" aria-label="目录操作">
            <a className="primary-link" href="mailto:submit@example.com?subject=提交公司目录条目">
              <Send size={17} />
              投稿或修正
            </a>
            <span className="updated">更新时间：{updatedAt}</span>
          </div>
        </div>

        <div className="summary-panel" aria-label="目录概览">
          <div>
            <strong>{companies.length}</strong>
            <span>收录公司</span>
          </div>
          <div>
            <strong>{activeCount}</strong>
            <span>活跃跟踪</span>
          </div>
          <div>
            <strong>{domainCount}</strong>
            <span>方向</span>
          </div>
          <div>
            <strong>{cityCount}</strong>
            <span>城市</span>
          </div>
        </div>
      </section>

      <section className="directory-section" aria-labelledby="directory-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Directory</p>
            <h2 id="directory-title">公司列表</h2>
          </div>
          <p>{filteredCompanies.length} / {companies.length} 条匹配</p>
        </div>

        <div className="controls" aria-label="筛选和搜索">
          <label className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索公司名、创始人、背景、备注"
              type="search"
            />
          </label>

          <div className="filter-grid">
            <label>
              <span>方向</span>
              <select value={domain} onChange={(event) => setDomain(event.target.value)}>
                {domains.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              <span>状态</span>
              <select
                value={active}
                onChange={(event) => setActive(event.target.value as typeof allValue | Company['active'])}
              >
                <option>{allValue}</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>城市</span>
              <select value={city} onChange={(event) => setCity(event.target.value)}>
                {cities.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              <span>标签</span>
              <select value={tag} onChange={(event) => setTag(event.target.value)}>
                {tags.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="list-header">
          <span>
            <Filter size={16} />
            条目
          </span>
          <span>公开来源仅作索引，不构成背书</span>
        </div>

        <div className="company-list">
          {filteredCompanies.map((company) => (
            <article className="company-card" key={company.name}>
              <div className="company-main">
                <div className="company-title">
                  <Building2 size={20} />
                  <div>
                    <h3>{company.name}</h3>
                    <p>{company.domain}</p>
                  </div>
                </div>
                <p className="background">{company.background}</p>
                <div className="tags">
                  {company.tags.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>

              <div className="company-meta">
                <span className={`status status-${company.active}`}>
                  {company.active === 'active' ? <CheckCircle2 size={15} /> : <CircleDashed size={15} />}
                  {statusLabels[company.active]}
                </span>
                <span>
                  <MapPin size={15} />
                  {company.city}
                </span>
                <span>创始人：{company.founders.join('、')}</span>
                <span>来源：{company.source}</span>
                <a href={company.website} target="_blank" rel="noreferrer">
                  官网
                  <ArrowUpRight size={15} />
                </a>
              </div>

              <p className="note">{company.note}</p>
            </article>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="empty-state">
            <h3>没有匹配条目</h3>
            <p>尝试减少筛选条件，或通过投稿入口补充新的公司线索。</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
